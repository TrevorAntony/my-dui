import React, { useEffect } from 'react';
import { useDataContext } from '../context/DataContext';

interface StaticDataProps {
  data: any[];
}

const StaticData: React.FC<StaticDataProps> = ({ data }) => {
  const { setData } = useDataContext();

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  return null;
};

export default StaticData;
