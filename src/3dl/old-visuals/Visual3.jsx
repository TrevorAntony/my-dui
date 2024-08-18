// Visual3.js
import React from 'react';

const Visual3 = ({ data }) => (
  <div>
    <h2>Visual 3</h2>
    <ul>
      {data.map((value, index) => (
        <li key={index}>Inner Value: {value}</li>
      ))}
    </ul>
  </div>
);

export default Visual3;