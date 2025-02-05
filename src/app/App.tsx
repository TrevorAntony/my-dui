import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "../AppLayout";
import ComponentA from "../_content-components/ComponentA";
import ComponentB from "../_content-components/ComponentB";
import ComponentC from "../_content-components/ComponentC";
import ComponentD from "../_content-components/ComponentD";
import Dashboard3DL from "../core/dashboard-3dl-parser/Dashboard3DL";
import GridLayoutTester from "../_content-components/GridLayoutTester";
import TabLayoutTester from "../_content-components/TabLayoutTester";
import SingleTableLayoutTester from "../_content-components/SingleTableLayoutTester";
import DataTaskHandler from "../core/duft-core-components/duft-layout-and-navigation/data-task-handler";
import Settings from "../core/duft-core-components/duft-settings/duft-settings";
import Login from "../authentication/login";
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
