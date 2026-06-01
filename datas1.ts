export interface IDrillingLimits {
  maxPumpPressure: number;
  minFlowIn: number;
  maxTorque: number;
}

export interface IDrillingHistoryPoint {
  timestamp: string; 
  depth: number;
  rop: number;
  hookLoad: number;
  weightOnBit: number;
  rpm: number;
  torque: number;
  pumpPressure: number;
  flowIn: number;
  flowOut: number;
  gasContent: number;
}

export interface IDrillingWell {
  id: number;
  wellName: string;
  status: 'бурение' | 'спо' | 'промывка' | 'простой';
  currentDepth: number;
  targetDepth: number;
  bottomHoleCoord: { x: number; y: number; z: number };
  rop: number;
  hookLoad: number;
  weightOnBit: number;
  rpm: number;
  torque: number;
  pumpPressure: number;
  flowIn: number;
  flowOut: number;
  gasContent: number;
  currentLayer: 'песок' | 'глина' | 'нефть' | 'скала';
  limits: IDrillingLimits;
  history: IDrillingHistoryPoint[]; 
}

export interface IDrillingDelta {
  id: IDrillingWell['id'];
  currentDepth: number;
  bottomHoleCoord: { x: number; y: number; z: number };
  rop: number;
  pumpPressure: number;
  torque: number;
  newHistoryPoint: IDrillingHistoryPoint;
}

export interface IWellBlueprint extends IDrillingWell {
  driftX: number;
  driftZ: number;
}

const defaultLimits: IDrillingLimits = {
  maxPumpPressure: 300,
  minFlowIn: 20,
  maxTorque: 40
};

export const drillingWellsData: IWellBlueprint[] = [
  {
    id: 2001,
    wellName: "Скв. 2001 (Вертикальная)",
    status: 'бурение',
    currentDepth: 200,
    targetDepth: 1200,
    bottomHoleCoord: { x: 0, y: -100, z: 0 },
    driftX: 0.01, driftZ: 0.01,
    rop: 0,
    hookLoad: 90, weightOnBit: 12, rpm: 70, torque: 18, pumpPressure: 210,
    flowIn: 30, flowOut: 29.5, gasContent: 0.2, currentLayer: 'песок',
    limits: { ...defaultLimits },
    history: []
  },
  {
    id: 2002,
    wellName: "Скв. 2002 (Наклонная S)",
    status: 'бурение',
    currentDepth: 650,
    targetDepth: 2300,
    bottomHoleCoord: { x: 10, y: -450, z: -5 },
    driftX: 0.15, driftZ: -0.05,
    rop: 0,
    hookLoad: 110, weightOnBit: 15, rpm: 85, torque: 22, pumpPressure: 240,
    flowIn: 35, flowOut: 34.2, gasContent: 0.8, currentLayer: 'глина',
    limits: { ...defaultLimits, maxPumpPressure: 320 },
    history: []
  },
  {
    id: 2003,
    wellName: "Скв. 2003 (Горизонтальная)",
    status: 'бурение',
    currentDepth: 1200,
    targetDepth: 1500,
    bottomHoleCoord: { x: 50, y: -800, z: 20 },
    driftX: 0.5, driftZ: 0.1,
    rop: 0,
    hookLoad: 75, weightOnBit: 8, rpm: 60, torque: 14, pumpPressure: 190,
    flowIn: 28, flowOut: 27.8, gasContent: 1.5, currentLayer: 'скала',
    limits: { ...defaultLimits, maxTorque: 30 },
    history: []
  },
  {
    id: 2004,
    wellName: "Скв. 2004 (Глубокая)",
    status: 'бурение',
    currentDepth: 1400,
    targetDepth: 2500,
    bottomHoleCoord: { x: -20, y: -1500, z: -30 },
    driftX: -0.05, driftZ: -0.1,
    rop: 0,
    hookLoad: 150, weightOnBit: 20, rpm: 90, torque: 30, pumpPressure: 280,
    flowIn: 40, flowOut: 39.1, gasContent: 0.4, currentLayer: 'скала',
    limits: { ...defaultLimits, maxPumpPressure: 350 },
    history: []
  },
  {
    id: 2005,
    wellName: "Скв. 2005 (Поиск нефти)",
    status: 'бурение',
    currentDepth: 2100,
    targetDepth: 2500,
    bottomHoleCoord: { x: 10, y: -2100, z: 10 },
    driftX: 0.02, driftZ: 0.02,
    rop: 0,
    hookLoad: 105, weightOnBit: 14, rpm: 75, torque: 20, pumpPressure: 225,
    flowIn: 32, flowOut: 31.8, gasContent: 4.5, currentLayer: 'нефть',
    limits: { ...defaultLimits },
    history: []
  },
  {
    id: 2006, wellName: "Скв. 2006 (Ожидание)", status: 'простой',
    currentDepth: 0, targetDepth: 1500, bottomHoleCoord: { x: 100, y: 0, z: 100 },
    driftX: 0.05, driftZ: 0.05, hookLoad: 50, weightOnBit: 0, rpm: 0, torque: 0, rop: 0,
    pumpPressure: 0, flowIn: 0, flowOut: 0, gasContent: 0.05, currentLayer: 'песок', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2007, wellName: "Скв. 2007 (СПО)", status: 'спо',
    currentDepth: 1850, targetDepth: 2400, bottomHoleCoord: { x: -40, y: -1850, z: 15 },
    driftX: -0.1, driftZ: 0.08, hookLoad: 125, weightOnBit: 0, rpm: 0, torque: 0, rop: 0,
    pumpPressure: 45, flowIn: 10, flowOut: 10.2, gasContent: 0.6, currentLayer: 'скала', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2008, wellName: "Скв. 2008 (Промывка)", status: 'промывка',
    currentDepth: 2900, targetDepth: 2300, bottomHoleCoord: { x: 15, y: -2900, z: -10 },
    driftX: 0.02, driftZ: -0.01, hookLoad: 140, weightOnBit: 5, rpm: 20, torque: 5, rop: 0,
    pumpPressure: 180, flowIn: 45, flowOut: 45, gasContent: 1.1, currentLayer: 'глина', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2009, wellName: "Скв. 2009 (Бурение)", status: 'бурение',
    currentDepth: 450, targetDepth: 1800, bottomHoleCoord: { x: -100, y: -450, z: 50 },
    driftX: -0.2, driftZ: 0.15, hookLoad: 88, weightOnBit: 14, rpm: 80, torque: 19, rop: 0,
    pumpPressure: 220, flowIn: 32, flowOut: 31.5, gasContent: 0.3, currentLayer: 'песок', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2010, wellName: "Скв. 2010 (Наклонная)", status: 'бурение',
    currentDepth: 1100, targetDepth: 2500, bottomHoleCoord: { x: 200, y: -1100, z: -80 },
    driftX: 0.3, driftZ: -0.1, hookLoad: 115, weightOnBit: 16, rpm: 75, torque: 24, rop: 0,
    pumpPressure: 250, flowIn: 38, flowOut: 37.2, gasContent: 0.9, currentLayer: 'глина', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2011, wellName: "Скв. 2011 (Горизонт)", status: 'бурение',
    currentDepth: 2400, targetDepth: 2550, bottomHoleCoord: { x: 600, y: -2350, z: 100 },
    driftX: 0.8, driftZ: 0.2, hookLoad: 95, weightOnBit: 10, rpm: 90, torque: 28, rop: 0,
    pumpPressure: 270, flowIn: 42, flowOut: 41.5, gasContent: 2.4, currentLayer: 'нефть', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2012, wellName: "Скв. 2012 (Авария)", status: 'простой',
    currentDepth: 980, targetDepth: 2000, bottomHoleCoord: { x: 10, y: -980, z: 5 },
    driftX: 0.01, driftZ: 0.01, hookLoad: 180, weightOnBit: 0, rpm: 0, torque: 0, rop: 0,
    pumpPressure: 0, flowIn: 0, flowOut: 0, gasContent: 0.1, currentLayer: 'скала', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2013, wellName: "Скв. 2013 (Бурение)", status: 'бурение',
    currentDepth: 1200, targetDepth: 2400, bottomHoleCoord: { x: -50, y: -3200, z: -200 },
    driftX: -0.05, driftZ: -0.3, hookLoad: 165, weightOnBit: 22, rpm: 65, torque: 35, rop: 0,
    pumpPressure: 310, flowIn: 48, flowOut: 47.5, gasContent: 1.8, currentLayer: 'скала', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2014, wellName: "Скв. 2014 (СПО)", status: 'спо',
    currentDepth: 500, targetDepth: 1200, bottomHoleCoord: { x: 30, y: -500, z: 30 },
    driftX: 0.1, driftZ: 0.1, hookLoad: 60, weightOnBit: 0, rpm: 0, torque: 0, rop: 0,
    pumpPressure: 30, flowIn: 5, flowOut: 5, gasContent: 0.2, currentLayer: 'песок', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2015, wellName: "Скв. 2015 (Бурение)", status: 'бурение',
    currentDepth: 1750, targetDepth: 2200, bottomHoleCoord: { x: 120, y: -2750, z: 80 },
    driftX: 0.15, driftZ: 0.1, hookLoad: 130, weightOnBit: 18, rpm: 70, torque: 26, rop: 0,
    pumpPressure: 290, flowIn: 40, flowOut: 39.5, gasContent: 3.1, currentLayer: 'нефть', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2016, wellName: "Скв. 2016 (Промывка)", status: 'промывка',
    currentDepth: 1500, targetDepth: 2000, bottomHoleCoord: { x: -20, y: -1500, z: -10 },
    driftX: -0.02, driftZ: -0.02, hookLoad: 100, weightOnBit: 2, rpm: 15, torque: 4, rop: 0,
    pumpPressure: 200, flowIn: 35, flowOut: 35, gasContent: 0.5, currentLayer: 'глина', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2017, wellName: "Скв. 2017 (Бурение)", status: 'бурение',
    currentDepth: 800, targetDepth: 2500, bottomHoleCoord: { x: 0, y: -800, z: 0 },
    driftX: 0.001, driftZ: 0.001, hookLoad: 110, weightOnBit: 15, rpm: 75, torque: 20, rop: 0,
    pumpPressure: 230, flowIn: 34, flowOut: 33.6, gasContent: 0.7, currentLayer: 'глина', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2018, wellName: "Скв. 2018 (Бурение)", status: 'бурение',
    currentDepth: 700, targetDepth: 2000, bottomHoleCoord: { x: -300, y: -4100, z: -150 },
    driftX: -0.4, driftZ: -0.2, hookLoad: 200, weightOnBit: 25, rpm: 55, torque: 40, rop: 0,
    pumpPressure: 350, flowIn: 55, flowOut: 54.1, gasContent: 1.2, currentLayer: 'скала', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2019, wellName: "Скв. 2019 (Поиск)", status: 'бурение',
    currentDepth: 2250, targetDepth: 2500, bottomHoleCoord: { x: 50, y: -2250, z: 50 },
    driftX: 0.05, driftZ: 0.05, hookLoad: 115, weightOnBit: 12, rpm: 85, torque: 22, rop: 0,
    pumpPressure: 245, flowIn: 36, flowOut: 35.8, gasContent: 5.2, currentLayer: 'нефть', limits: { ...defaultLimits }, history: []
  },
  {
    id: 2020, wellName: "Скв. 2020 (Верхняя)", status: 'бурение',
    currentDepth: 150, targetDepth: 800, bottomHoleCoord: { x: 20, y: -150, z: -20 },
    driftX: 0.02, driftZ: -0.02, hookLoad: 70, weightOnBit: 8, rpm: 60, torque: 10, rop: 0,
    pumpPressure: 150, flowIn: 25, flowOut: 24.8, gasContent: 0.1, currentLayer: 'песок', limits: { ...defaultLimits }, history: []
  }
];