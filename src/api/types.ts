// types.ts
export interface AppState {
  data: any; // Adjust the type according to your API response
}

export interface AppStateContextProps {
  state: AppState;
  setData: (data: any) => void;
}
