import React from "react";
import { Button } from "flowbite-react";
import { Grid, GridHeader } from "../ui-components/grid-components";

const ComponentB: React.FC = () => {
  return (
    <Grid>
      <GridHeader>Component B</GridHeader>
      This is Component B{" "}
      <Button className="bg-red-500 hover:bg-red-600">Click me</Button>{" "}
    </Grid>
  );
};

export default ComponentB;
