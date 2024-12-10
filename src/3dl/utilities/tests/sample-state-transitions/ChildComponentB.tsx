import React, { useEffect } from "react";
import { useStateContext } from "./ParentComponentA";

const ChildComponentB = ({ onManualUpdate }) => {
  const { state, setState } = useStateContext();

  useEffect(() => {
    // Simulate automatic state transitions
    const sequence = [4, 8, 9];
    let index = 0;

    const interval = setInterval(() => {
      if (index < sequence.length) {
        setState(sequence[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Simulate asynchronous updates every 1 second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [setState]);

  // Provide a manual update callback
  useEffect(() => {
    if (onManualUpdate) {
      onManualUpdate(() => {
        setState(7); // Manual update to set state to 7
      });
    }
  }, [onManualUpdate, setState]);

  return <div>Current State: {state}</div>;
};

export default ChildComponentB;
