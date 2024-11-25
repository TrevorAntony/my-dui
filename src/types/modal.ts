import type {
  modalPixelWidthMap,
  modalSymbolicWidthMap,
  modalViewportHeightRatioMap,
  modalViewportHeightMap,
} from "../helpers/constants";

export type Position = {
  x: number;
  y: number;
};

export type ModalConfigParams = {
  resize: string;
  modalWidth:
    | keyof typeof modalPixelWidthMap
    | keyof typeof modalSymbolicWidthMap;
  modalHeight:
    | keyof typeof modalViewportHeightRatioMap
    | keyof typeof modalViewportHeightMap;
};
