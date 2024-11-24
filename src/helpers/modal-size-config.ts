import { modalViewportHeightRatioMap, modalPixelWidthMap } from "./constants";

export const calculateInitialModalSizeConfig = (
  modalWidth: keyof typeof modalPixelWidthMap,
  modalHeight: keyof typeof modalViewportHeightRatioMap,
) => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const width = modalPixelWidthMap[modalWidth];
  const heightPercentage = modalViewportHeightRatioMap[modalHeight];
  const height = heightPercentage && windowHeight * heightPercentage;
  const minHeight = heightPercentage <= 0.08 ? 180 : 150;
  const x = (windowWidth - width) / 2;
  const y =
    heightPercentage <= 0.36
      ? -(windowHeight - height) * 0.2
      : -(windowHeight - height) * 0.7;

  return { width, height, minHeight, x, y };
};
