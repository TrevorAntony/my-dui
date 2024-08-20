import React from "react";
import { useParams } from "react-router-dom";
import { DuftGrid } from "../ui-components/grid-components";

type ComponentAParams = {
  id?: string; // Make the id optional
};

const ComponentA: React.FC = () => {
  const { id } = useParams<ComponentAParams>();

  return <DuftGrid>This is Component A. {id ? `ID: ${id}` : "No ID"}</DuftGrid>;
};

export default ComponentA;
