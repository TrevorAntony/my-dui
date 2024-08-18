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

// const ComponentAA: React.FC = () => <div>Component A</div>;
// const ComponentBB: React.FC = () => <div>Component B</div>;

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
          </Route>
          <Route path="s" element={<SamplePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
