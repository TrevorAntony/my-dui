import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "../AppLayout";
import ComponentA from "../_playground/_content-components/ComponentA";
import ComponentB from "../_playground/_content-components/ComponentB";
import ComponentD from "../_playground/_content-components/ComponentD";
import Dashboard3DL from "../features/dashboard-3dl-parser/Dashboard3DL";
import GridLayoutTester from "../_playground/_content-components/GridLayoutTester";
import TabLayoutTester from "../_playground/_content-components/TabLayoutTester";
import SingleTableLayoutTester from "../_playground/_content-components/SingleTableLayoutTester";
import DataTaskHandler from "../features/app-shell/duft-layout-and-navigation/data-task-handler";
import Settings from "../features/app-shell/duft-settings/duft-settings";
import Login from "../authentication/login";
import "./App.css";
import ComponentC from "../_playground/_content-components/ComponentC";

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
