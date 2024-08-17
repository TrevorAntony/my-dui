import React from 'react';
import { useParams } from 'react-router-dom';

type ComponentAParams = {
  id?: string; // Make the id optional
};

const ComponentA: React.FC = () => {
  const { id } = useParams<ComponentAParams>();

  return <div>This is Component A. {id ? `ID: ${id}` : 'No ID'}</div>;
};

export default ComponentA;