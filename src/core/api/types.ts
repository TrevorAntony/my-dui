export interface AppState {
  data: unknown;
}

export interface AppStateContextProps {
  state: AppState;
  setData: (data: unknown) => void;
}
