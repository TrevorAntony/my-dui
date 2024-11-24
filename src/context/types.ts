export type Feature =
  | {
      data_tasks?: boolean;
    }
  | {
      log_level?: string;
    }
  | {
      server_uploads?: boolean;
    }
  | {
      task_scheduler?: boolean;
    }
  | {
      user_authentication?: boolean;
    };

interface User {
  id: number;
  username: string;
  email: string;
}

interface Settings {
  appName: string;
  footer: string;
  custom: string;
  [key: string]: string; // Allow for additional custom settings
}

export interface Config {
  features: Feature[];
  currentUser: User | null;
  currentUserPermissions: string[];
  currentUserRoles: string[];
  settings: Settings;
  version: string;
}

export interface AppState {
  config: Config | null;
}

export type AppStateAction = {
  type: "SET_CONFIG";
  payload: Config;
};
