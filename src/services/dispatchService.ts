import type { Dispatch } from "react";
import type { AppStateAction } from "../context/types";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class DispatchService {
  private static dispatch: Dispatch<AppStateAction> | null = null;

  static setDispatch(dispatchFn: Dispatch<AppStateAction>) {
    this.dispatch = dispatchFn;
  }

  static getDispatch(): Dispatch<AppStateAction> {
    if (!this.dispatch) {
      throw new Error("Dispatch function not initialized");
    }
    return this.dispatch;
  }
}

export default DispatchService;
