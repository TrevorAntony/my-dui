// Visual3.js
import React from "react";
import { useDataContext } from "../context/DataContext";

const Visual3 = () => {
  const { data } = useDataContext();

  return (
    <div>
      <h2>Visual 3</h2>
      <ul>
        {data.map((value, index) => (
          <li key={index}>Inner Value: {value}</li>
        ))}
      </ul>
    </div>
  );
};
export default Visual3;
