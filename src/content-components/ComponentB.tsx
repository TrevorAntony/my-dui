import React from "react";
import { Button } from "flowbite-react";
import { DuftGrid, DuftGridHeader } from "../ui-components/grid-components";

const ComponentB: React.FC = () => {
  return (
    <DuftGrid>
      <DuftGridHeader>Component B</DuftGridHeader>
      This is Component B{" "}
      <Button className="bg-red-500 hover:bg-red-600">Click me</Button>{" "}
    </DuftGrid>
  );
};

export default ComponentB;
