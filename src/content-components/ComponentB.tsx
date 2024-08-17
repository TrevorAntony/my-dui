import React from 'react';
import { Button } from "flowbite-react";


const ComponentB: React.FC = () => {
  return <div>This is Component B <Button className="bg-red-500 hover:bg-red-600">Click me</Button> </div>;
};

export default ComponentB;