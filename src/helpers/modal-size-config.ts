import { modalHeightMap, modalWidthMap } from "./constants";

export const calculateInitialModalSizeConfig = (
  modalWidth: keyof typeof modalWidthMap,
  modalHeight: keyof typeof modalHeightMap,
) => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const width = modalWidthMap[modalWidth];
  const heightPercentage = modalHeightMap[modalHeight];
  const height = heightPercentage && windowHeight * heightPercentage;
  const minHeight = heightPercentage <= 0.08 ? 180 : 150;
  const x = (windowWidth - width) / 2;
  const y =
    heightPercentage <= 0.3
      ? -(windowHeight - height) * 0.2
      : -(windowHeight - height) * 0.7;

  return { width, height, minHeight, x, y };
};
