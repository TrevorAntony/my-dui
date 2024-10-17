import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import ComponentA from "./content-components/ComponentA";
import ComponentB from "./content-components/ComponentB";
import ComponentC from "./content-components/ComponentC";
import "./App.css";
import SamplePage from "./pages";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import ComponentD from "./content-components/ComponentD";
import APITestComponent from "./content-components/APITestComponent";
import Dashboard3DL from "./3dlcomponents/Dashboard3DL";
import GridLayoutTester from "./content-components/GridLayoutTester";
import TabLayoutTester from "./content-components/TabLayoutTester";
import SingleTableLayoutTester from "./content-components/SingleTableLayoutTester";
import DataTaskHandler from "./ui-components/data-task-handler";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<FlowbiteWrapper />}>
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard/:id?" element={<Dashboard3DL />} />
            <Route path="a/:id?" element={<ComponentA />} />
            <Route path="b" element={<ComponentB />} />
            <Route path="c" element={<ComponentC />} />
            <Route path="d" element={<ComponentD />} />
            <Route path="api" element={<APITestComponent />} />
            <Route path="grid" element={<GridLayoutTester />} />
            <Route path="tab" element={<TabLayoutTester />} />
            <Route path="table" element={<SingleTableLayoutTester />} />
            <Route path="data-task/:id" element={<DataTaskHandler />} />
          </Route>
          <Route path="s" element={<SamplePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
