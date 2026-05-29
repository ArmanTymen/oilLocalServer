export interface IFieldCalculations {
    id: number;
    type: 'allFields' | 'field' | 'cluster' | 'well';
    debit: number;
}