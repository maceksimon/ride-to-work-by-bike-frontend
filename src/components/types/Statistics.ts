export enum StatisticsId {
  co2 = 'co2',
  distance = 'distance',
  routes = 'routes',
}

export interface ItemStatistics {
  id?: StatisticsId;
  icon: string;
  label: string;
  value: string;
}
