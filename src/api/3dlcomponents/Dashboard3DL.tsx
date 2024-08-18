import React from "react";
import { useParams } from "react-router-dom";

const Dashboard3DL: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <div>
      <h1>Dashboard 3D Layout</h1>
      {id ? <p>Dashboard ID: {id}</p> : <p>No ID provided</p>}
      {/* Add your dashboard content and 3D elements here */}
    </div>
  );
};

export default Dashboard3DL;
