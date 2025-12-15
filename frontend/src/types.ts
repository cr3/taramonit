export interface ServiceStatus {
  name: string;
  status: 'up' | 'down';
  availability_24h: number | null;
}

export interface OverallStatus {
  status: 'operational' | 'degraded';
  services: ServiceStatus[];
}
