import type { AppState } from "../core/context/types";

export const checkAuthEnabled = (state: AppState): boolean => {
  return state.config?.features?.user_authentication ?? false;
};

export const checkUserLoggedIn = (state: AppState): boolean => {
  return Boolean(state.config?.currentUser?.username);
};
