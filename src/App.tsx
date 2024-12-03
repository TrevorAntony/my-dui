import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import ComponentA from "./content-components/ComponentA";
import ComponentB from "./content-components/ComponentB";
import ComponentC from "./content-components/ComponentC";
import ComponentD from "./content-components/ComponentD";
import Dashboard3DL from "./3dlcomponents/Dashboard3DL";
import GridLayoutTester from "./content-components/GridLayoutTester";
import TabLayoutTester from "./content-components/TabLayoutTester";
import SingleTableLayoutTester from "./content-components/SingleTableLayoutTester";
import DataTaskHandler from "./ui-components/data-task-handler";
import Settings from "./ui-components/duft-settings/duft-settings";
import Login from "./ui-components/login";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Root path renders Dashboard3DL with 'home' as the ID param */}
          <Route index element={<Dashboard3DL defaultId="home" />} />
          <Route path="dashboard/:id?" element={<Dashboard3DL />} />
          <Route path="a/:id?" element={<ComponentA />} />
          <Route path="b" element={<ComponentB />} />
          <Route path="c" element={<ComponentC />} />
          <Route path="d" element={<ComponentD />} />
          <Route path="grid" element={<GridLayoutTester />} />
          <Route path="tab" element={<TabLayoutTester />} />
          <Route path="table" element={<SingleTableLayoutTester />} />
          <Route path="data-task/:id" element={<DataTaskHandler />} />
          <Route path="settings" element={<Settings />} />

          {/* Catch-all route for unavailable routes */}
          <Route path="*" element={<Navigate to="/dashboard/home" />} />
        </Route>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
