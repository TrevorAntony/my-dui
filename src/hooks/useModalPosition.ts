import { useState } from "react";

interface Position {
  x: number;
  y: number;
}

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
