import React from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { useState } from 'react';
import { useDashboardContext } from '../utilities/Dashboard';

const PivotTable = ({ data }) => {
  const [pivotState, setPivotState] = useState({});
  const { state } = useDashboardContext();

  return (
    <div>
      {state.debug && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          Debug On
        </div>
      )}
      <PivotTableUI
        data={data}
        onChange={(s) => setPivotState(s)}
        {...pivotState}
      />
    </div>
  );
};

export default PivotTable;