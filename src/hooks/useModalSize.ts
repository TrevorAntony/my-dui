import { useState } from "react";

interface Size {
  width: number;
  height: number;
}

export const useModalSize = (initialWidth: number, initialHeight: number) => {
  const [size, setSize] = useState<Size>({
    width: initialWidth,
    height: initialHeight,
  });

  const handleResize = (width: number, height: number) => {
    setSize({ width, height });
  };

  return { size, handleResize };
};
