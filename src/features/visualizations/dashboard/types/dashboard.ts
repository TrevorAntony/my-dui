export type DashboardState = {
  filters: Record<string, string>;
  data: Record<string, string[]>;
  debug: boolean;
  designSystem: string;
  theme?: Record<string, unknown>;
  layout: string;
};
