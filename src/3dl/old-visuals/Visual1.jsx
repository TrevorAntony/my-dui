// Visual1.js
import React from "react";
import { useDataContext } from "../context/DataContext";

const Visual1 = () => {
  const { data } = useDataContext();

  if (!data || !Array.isArray(data)) {
    return (
      <div>
        <h2>Visual 1</h2>
        <div>No data available</div>
      </div>
    ); // Handle case where data is not an array
  }

  <div>
    <h2>Visual 1</h2>
    <ul>
      {data.map((value, index) => (
        <li key={index}>Value: {value}</li>
      ))}
    </ul>
  </div>;
};

export default Visual1;
