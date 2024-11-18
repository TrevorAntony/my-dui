import { useState } from "react";
import type { Position } from "../types/modal";

export const useModalPosition = (initialX: number, initialY: number) => {
  const [position, setPosition] = useState<Position>({
    x: initialX,
    y: initialY,
  });

  const handleDragStop = (x: number, y: number) => {
    setPosition({ x, y });
  };

  return { position, handleDragStop };
};
