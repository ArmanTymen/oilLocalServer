import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { IFieldData, initialData } from './data/production.data'; 
import { 
  drillingWellsData, 
  IWellBlueprint, 
  IDrillingWell, 
  IDrillingHistoryPoint, 
  IDrillingDelta
} from './data/drilling.data';

const app = express();
const PORT = 3001;
app.use(cors());

let fields: IFieldData[] = initialData;
const HISTORY_POINTS_COUNT = 2000;

/* =====================================================
   UPDATED HISTORY GENERATION WITH CHRONOLOGY & NOISE
===================================================== */

const generateInitialHistory = (well: IWellBlueprint): IDrillingHistoryPoint[] => {
  const history: IDrillingHistoryPoint[] = [];
  const step = 2;
  
  const totalPoints = Math.floor(well.currentDepth / step) + 1;
  const nowMs = Date.now();
  const TIME_STEP_MS = 3000;

  let index = 0;
  for (let depth = 0; depth <= well.currentDepth; depth += step) {
    const timeOffset = (totalPoints - index) * TIME_STEP_MS;
    const pointTimestamp = new Date(nowMs - timeOffset).toISOString();

    const isDrilling = well.status === 'бурение';
    const pressureNoise = isDrilling ? (Math.random() - 0.5) * 12 : (Math.random() - 0.5) * 2;
    const gasNoise = isDrilling ? Math.random() * 0.4 : 0.01;

    history.push({
      timestamp: pointTimestamp,
      depth: Number(depth.toFixed(2)),
      rop: isDrilling ? Math.round(15 + Math.random() * 10) : 0,
      hookLoad: Number((well.hookLoad + (Math.random() - 0.5) * 4).toFixed(1)),
      weightOnBit: isDrilling ? Number((well.weightOnBit + (Math.random() - 0.5) * 2).toFixed(1)) : 0,
      rpm: well.rpm,
      torque: isDrilling ? Math.round(well.torque + (Math.random() - 0.5) * 3) : 0,
      pumpPressure: well.pumpPressure > 0 ? Math.round(well.pumpPressure + pressureNoise) : 0,
      flowIn: well.flowIn,
      flowOut: well.flowOut > 0 ? Number((well.flowIn - 0.5 + Math.random() * 0.3).toFixed(1)) : 0,
      gasContent: Number((well.gasContent + gasNoise).toFixed(2))
    });

    index++;
  }

  return history.slice(-200);
};

/* =====================================================
   ACTIVE DRILLING DATA (С СОЗДАННОЙ HISTORY)
===================================================== */

const activeDrillingData: IWellBlueprint[] = drillingWellsData.map((well) => {
  return {
    ...well,
    history: generateInitialHistory(well)
  };
});

/* =====================================================
   API
===================================================== */

// Добыча
app.get('/fields', (req, res) => {
  res.json(fields);
});

// Бурение
app.get('/drilling', (req, res) => {
  const clientData: IDrillingWell[] = activeDrillingData.map(
    ({ driftX, driftZ, ...rest }) => rest
  );

  res.json(clientData);
});

/* =====================================================
   SERVER
===================================================== */

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const io = new Server(server, { cors: { origin: '*' } });

/* =====================================================
   SIMULATION
===================================================== */

function updateFields(currentFields: IFieldData[]): IFieldData[] {
  const changed: IFieldData[] = [];

  currentFields.forEach(field => {
    let hasChanges = false;

    const newClusters = field.clusters.map(cluster => ({
      ...cluster,
      wells: cluster.wells.map(well => {
        if (Math.random() < 0.1) {
          hasChanges = true;

          return {
            ...well,
            debit: Math.round(well.debit * (0.95 + Math.random() * 0.1)),
            pressure: Math.round(well.pressure * (0.98 + Math.random() * 0.04)),
          };
        }

        return well;
      })
    }));

    if (hasChanges) {
      changed.push({ ...field, clusters: newClusters });
    }
  });

  return changed;
}

setInterval(() => {
  const delta = updateFields(fields);
  if (delta.length) {
    io.emit('fields:update', delta);
  }
}, 5000);

/* =====================================================
   DRILLING UPDATE LOOP
===================================================== */

function processDrillingStep(wells: IWellBlueprint[]): IDrillingDelta[] {
  const updates: IDrillingDelta[] = [];
  const now = new Date().toISOString();

  wells.forEach(well => {
    if (well.status === 'бурение' && well.currentDepth < well.targetDepth) {

      const step = 0.1 + Math.random() * 0.2;

      well.currentDepth += step;
      well.bottomHoleCoord.y = -well.currentDepth;
      well.bottomHoleCoord.x += well.driftX * step;
      well.bottomHoleCoord.z += well.driftZ * step;

      well.rop = Math.round(step * 1200);
      well.pumpPressure = Math.max(100, well.pumpPressure + (Math.random() - 0.5) * 5);
      well.torque = Math.max(5, well.torque + (Math.random() - 0.5) * 2);

      const newPoint: IDrillingHistoryPoint = {
        timestamp: now,
        depth: Number(well.currentDepth.toFixed(2)),
        rop: well.rop,
        hookLoad: well.hookLoad + (Math.random() - 0.5),
        weightOnBit: well.weightOnBit + (Math.random() - 0.5),
        rpm: well.rpm,
        torque: well.torque,
        pumpPressure: well.pumpPressure,
        flowIn: well.flowIn,
        flowOut: well.flowOut,
        gasContent: well.gasContent + (Math.random() * 0.05)
      };

      well.history.push(newPoint);
      if (well.history.length > HISTORY_POINTS_COUNT) {
        well.history.shift(); 
      }

      updates.push({
        id: well.id,
        currentDepth: well.currentDepth,
        bottomHoleCoord: { ...well.bottomHoleCoord },
        rop: well.rop,
        pumpPressure: well.pumpPressure,
        torque: well.torque,
        newHistoryPoint: newPoint
      });
    }
  });

  return updates;
}

setInterval(() => {
  const updates = processDrillingStep(activeDrillingData);

  if (updates.length > 0) {
    io.emit('drilling:update', updates);
  }
}, 3000);