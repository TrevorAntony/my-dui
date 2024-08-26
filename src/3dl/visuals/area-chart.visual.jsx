import React from 'react';
import BaseXYChart from '../base-visuals/base-xy-chart';
import ChartComponent from '../ui-elements/chart-component';

const AreaChart = ({
    container: Container,
    header = 'Bar Chart',
    subHeader = header,
    ...props
}) => {
    const content = <BaseXYChart {...props} chartType="area" />;

    return Container ? (
        <Container header={header} subHeader={subHeader}>
            {content}
        </Container>
    ) : (
        content
    );
};

export default AreaChart;
