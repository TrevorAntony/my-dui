import React from 'react';
import { useDataContext } from '../context/DataContext';

interface StaticDataProps {
  data: any[];
}

const StaticData: React.FC<StaticDataProps> = ({ data }) => {
  const { setData } = useDataContext();

  setData(data);

  return null;
};

export default StaticData;
