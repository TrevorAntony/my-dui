// src/components/MyComponent.tsx
import React, { useEffect } from "react";
import { useAppState } from "../AppStateContext";
import { fetchDataAndStore, fetchDataWithoutStore } from "../api/api";
import CardComponent from "../components/card-component";

const APITestComponent: React.FC = () => {
  const { state, setData } = useAppState();

  useEffect(() => {
    fetchDataAndStore("/navigation", setData);
  }, [setData]);

  const handleFetchWithoutStore = async () => {
    const data = await fetchDataWithoutStore("/other-endpoint");

    return data;
  };

  return (
    <CardComponent header="Get Navigation">
      <div>{state.data ? JSON.stringify(state.data) : "Loading..."}</div>
      <button onClick={handleFetchWithoutStore}>Fetch Without Storing</button>
    </CardComponent>
  );
};

export default APITestComponent;
