import { render, act } from "@testing-library/react";
import ParentComponentA from "./ParentComponentA";
import ChildComponentB from "./ChildComponentB";
import { expect, test } from "vitest";
import React from "react";

test("state transitions match expected sequence, including initial state", async () => {
  const stateTransitions = [];
  let manualUpdateFn;

  let currentState;
  const getState = () => currentState;

  const waitForState = (expectedState, getState) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (getState() === expectedState) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  const InterceptingWrapper = ({ children }) => {
    const [state, setState] = React.useState(0);

    const monitoredSetState = React.useCallback((newState) => {
      console.log(`Setting state to: ${newState}`);
      if (stateTransitions[stateTransitions.length - 1] !== newState) {
        stateTransitions.push(newState);
      }
      currentState = newState;
      setState(newState);
    }, []);

    React.useEffect(() => {
      if (stateTransitions.length === 0) {
        stateTransitions.push(state);
        currentState = state;
      }
    }, [state]);

    return (
      <ParentComponentA state={state} setState={monitoredSetState}>
        {children}
      </ParentComponentA>
    );
  };

  // Render the component with the intercepting wrapper
  render(
    <InterceptingWrapper>
      <ChildComponentB onManualUpdate={(fn) => (manualUpdateFn = fn)} />
    </InterceptingWrapper>
  );

  // Wait for state to update to 4
  await waitForState(4, getState);
  expect(stateTransitions).toEqual([0, 4]);

  // Wait for state to update to 8
  await waitForState(8, getState);
  expect(stateTransitions).toEqual([0, 4, 8]);

  // Wait for state to update to 9
  await waitForState(9, getState);
  expect(stateTransitions).toEqual([0, 4, 8, 9]);

  // Trigger the manual update via onManualUpdate
  act(() => {
    manualUpdateFn(); // Properly call the manual update callback
  });

  // Wait for state to update to 7
  await waitForState(7, getState);
  expect(stateTransitions).toEqual([0, 4, 8, 9, 7]);
}, 10000);
