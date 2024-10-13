export enum StatisticsId {
  co2 = 'co2',
  distance = 'distance',
  routes = 'eco_trip_count',
  frequency = 'frequency',
}

export interface ItemStatistics {
  id: StatisticsId;
  icon?: string;
  value: string;
}
