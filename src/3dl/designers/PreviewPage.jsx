import React, { useState } from "react";
import Dashboard from "../utilities/Dashboard";
import Filters from "../filters/filters";
import Filter from "../filters/filter";
import DataSet from "../utilities/data-set";
import JSXParser from "react-jsx-parser";
import Visual1 from "../old-visuals/Visual1";
import Visual3 from "../old-visuals/Visual3";
import Visual5 from "../old-visuals/Visual5";
import Section from "../ui-elements/Section";
import PieChart from "../visuals/pie-chart.visual";
import DonutChart from "../visuals/donut-chart.visual";
import RadialBarChart from "../visuals/radial-bar-chart.visual";
import PolarAreaChart from "../visuals/polar-area-chart.visual";
import BarChart from "../visuals/bar-chart.visual";
import LineChart from "../visuals/line-chart.visual";
import HeatmapChart from "../visuals/heat-map-chart.visual";
import RadarChart from "../visuals/radar-chart.visual";

const PreviewPage = () => {
  const [input3DL, setInput3DL] = useState(`
    <Dashboard>
      <Filters>
        <Filter name="gender" values="Male,Female" />
        <Filter name="age" values_query="SELECT * FROM dim_age" />
        <DataSet staticData={['Apple', 'Banana', 'Cherry']}>
          <Visual1 />
          <Visual3 />
          <Filters>
            <Filter name="occupation" values_query="SELECT * FROM dim_occupation" />
            <DataSet query="SELECT * FROM dim_occupation_table">
              <Visual3 />
            </DataSet>
          </Filters>
        </DataSet>
        <Section title="Tiles">
          <DataSet staticData={[1200]}>
            <Visual5 title="Total Users" backgroundColor="#e0f7fa" color="#00796b" />
          </DataSet>
          <DataSet staticData={[300]}>
            <Visual5 title="Active Sessions" backgroundColor="#f3e5f5" color="#6a1b9a" />
          </DataSet>
          <DataSet staticData={[12500]}>
            <Visual5 title="Revenue" backgroundColor="#fff3e0" color="#ef6c00" />
          </DataSet>
        </Section>
        <Section title="Charts">
          <DataSet
            staticData={[
              { category: 'Apples', value: 30 },
              { category: 'Bananas', value: 40 },
              { category: 'Cherries', value: 25 },
            ]}
          >
            <BarChart header="sample bar chart"/>
            <LineChart header="sample line chart"/>
            <HeatmapChart header="sample heat map chart"/>
            <RadarChart header="sample radar chart"/>
          </DataSet>
          <DataSet
          staticData={[
            { category: 'Jan', value: 30 },
            { category: 'Feb', value: 40 },
            { category: 'Mar', value: 35 },
            { category: 'Apr', value: 50 },
            { category: 'May', value: 49 },
            { category: 'Jun', value: 60 }
          ]}
          >
            <PieChart header="sample pie chart"/>
            <DonutChart header="sample donut chart"/>
            <RadialBarChart header="sample radial bar chart"/>
            <PolarAreaChart header="sample polar area chart"/>
          </DataSet>
        </Section>
        <Section title="Data Table">
          <DataSet
          staticData={[
              { category: 'Jan', value: 30 },
              { category: 'Feb', value: 40 },
              { category: 'Mar', value: 35 },
              { category: 'Apr', value: 50 },
              { category: 'May', value: 49 },
              { category: 'Jun', value: 60 }
            ]}
          >
          </DataSet>
        </Section>
      </Filters>
    </Dashboard>
  `);

  const [jsxString, setJsxString] = useState(input3DL);

  const handlePreview = () => {
    setJsxString(input3DL);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>3DL Dashboard Preview</h1>
      <textarea
        value={input3DL}
        onChange={(e) => setInput3DL(e.target.value)}
        style={{ width: "100%", height: "200px", marginBottom: "20px" }}
      />
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handlePreview}>Preview Dashboard</button>
      </div>
      <div style={{ border: "1px solid #ccc", padding: "20px" }}>
        <h2>Preview:</h2>
        <JSXParser
          components={{
            Dashboard,
            Filters,
            Filter,
            DataSet,
            Visual1,
            Visual3,
            Visual5,
            Section,
            PieChart,
            DonutChart,
            RadialBarChart,
            PolarAreaChart,
            BarChart,
            LineChart,
            HeatmapChart,
            RadarChart,
          }}
          jsx={jsxString}
        />
      </div>
    </div>
  );
};

export default PreviewPage;
