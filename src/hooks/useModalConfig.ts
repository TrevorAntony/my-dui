import { useRef, useMemo } from "react";
import { useModalSize } from "../hooks/useModalSize";
import type { Position } from "../types/modal";
import { useModalPosition } from "../hooks/useModalPosition";
import { calculateInitialModalSizeConfig } from "../helpers/modal-size-config";
import type { ModalConfigParams } from "../types/modal";
import {
  modalSymbolicWidthMap,
  modalViewportHeightMap,
} from "../helpers/constants";

export function useModalConfig({
  resize,
  modalWidth,
  modalHeight,
}: ModalConfigParams): {
  resolvedWidth: string | number;
  containerProps:
    | {
        resolvedModalWidth: number;
        resolvedModalHeight: number;
        position: Position;
        handleDragStop: (x: number, y: number) => void;
        handleResize: (width: number, height: number) => void;
        initialConfig: {
          minHeight: number;
          width: number;
          height: number;
          x: number;
          y: number;
        };
        closeButtonRef: React.RefObject<HTMLButtonElement>;
        executeButtonRef: React.RefObject<HTMLButtonElement>;
      }
    | Record<string, never>;
  finalModalBodyStyle: React.CSSProperties;
} {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const executeButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldResize = resize === "true";

  const initialConfig = useMemo(
    () => calculateInitialModalSizeConfig(modalWidth, modalHeight),
    [modalWidth, modalHeight],
  );

  const { size, handleResize } = useModalSize(
    initialConfig.width,
    initialConfig.height,
  );
  const { position, handleDragStop } = useModalPosition(
    initialConfig.x,
    initialConfig.y,
  );

  const resolvedWidth = shouldResize
    ? size.width
    : modalSymbolicWidthMap[modalWidth] || "7xl";

  const resolvedHeight = shouldResize
    ? size.height - 116
    : modalViewportHeightMap[modalHeight] || "auto";

  const containerProps = shouldResize
    ? {
        resolvedModalWidth: size.width,
        resolvedModalHeight: size.height,
        position,
        handleDragStop,
        handleResize,
        initialConfig,
        closeButtonRef,
        executeButtonRef,
      }
    : ({} as Record<string, never>);

  const finalModalBodyStyle: React.CSSProperties = {
    height: resolvedHeight,
    maxWidth: shouldResize ? undefined : resolvedWidth,
    overflowY: "auto" as React.CSSProperties["overflowY"],
    overflowX: "auto" as React.CSSProperties["overflowX"],
  };

  return {
    resolvedWidth,
    containerProps,
    finalModalBodyStyle,
  };
}
