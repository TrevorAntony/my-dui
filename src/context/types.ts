export interface Features {
  data_tasks: boolean;
  log_level: string;
  server_uploads: boolean;
  task_scheduler: boolean;
  user_authentication: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface Credits {
  organisaton: string;
  department: string;
  website: string;
  productOwners: string[];
  developers: string[];
}

interface Settings {
  name: string;
  appName: string;
  footer: string;
  custom: string;
  version: string;
  logoURL: string;
  repository: string;
  credits: Credits;
  additionalInfo: string;
  [key: string]: any; // Allow for additional custom settings
}

export interface Config {
  features: Features;
  currentUser: User | null;
  currentUserPermissions: string[];
  currentUserRoles: string[];
  settings: Settings;
  version: string;
  serverBaseURL: string;
  pythonPath: string;
  pythonVersion: string;
  directories: Record<string, unknown>;
}

export enum GlobalState {
  SPLASH = "SPLASH",
  AUTH_REQUIRED = "AUTH_REQUIRED",
  AUTH_REFRESH_REQUIRED = "AUTH_REFRESH_REQUIRED",
  APP_READY = "APP_READY",
}
export interface AppState {
  config: Config | null;
  state: GlobalState;
}

export type AppStateAction =
  | { type: "SET_CONFIG"; payload: Config }
  | { type: "SET_STATE"; payload: GlobalState };
