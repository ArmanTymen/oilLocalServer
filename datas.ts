export interface IFieldData {
  id: number;
  field: string;
  clusters: {
    id: number;
    cluster: string;
    wells: {
      id: number;
      well: string;
      I: number;
      U: number;
      debit: number;
      temperature: number,
      pressure: number,
      flowRate: number,
      nominalI: number;
      nominalU: number;
      nominalDebit: number;
      nominalTemperature: number,
      nominalPressure: number,
      nominalFlowRate: number
    }[];
  }[];
}

const fieldsNames = [
  "Приобское", "Самотлорское", "Ванкорское", "Ямбургское", "Бованенковское",
  "Уренгойское", "Заполярное", "Русское", "Мессояхское", "Талаканское"
];

const generateHeavyData = (): IFieldData[] => {
  return fieldsNames.map((name, fIdx) => ({
    id: fIdx + 1,
    field: name,
    clusters: Array.from({ length: 10 }, (_, cIdx) => ({
      id: (fIdx + 1) * 100 + cIdx,
      cluster: `Куст ${cIdx + 1}`,
      wells: Array.from({ length: 6 }, (_, wIdx) => {
        const id = (fIdx + 1) * 1000 + (cIdx + 1) * 10 + wIdx;
        return {
          id,
          well: `Скв. ${id}`,
          I: 20 + Math.random() * 10,
          U: 380 + Math.random() * 40,
          debit: 100 + Math.random() * 20,
          temperature: 50 + Math.random() * 10,
          pressure: 100 + Math.random() * 10,
          flowRate: 200 + Math.random() * 50,
          nominalI: 25,
          nominalU: 400,
          nominalDebit: 110,
          nominalTemperature: 55,
          nominalPressure: 105,
          nominalFlowRate: 220
        };
      })
    }))
  }));
};

export const initialData: IFieldData[] = generateHeavyData();