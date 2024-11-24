import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import ComponentA from "./content-components/ComponentA";
import ComponentB from "./content-components/ComponentB";
import ComponentC from "./content-components/ComponentC";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import ComponentD from "./content-components/ComponentD";
import APITestComponent from "./content-components/APITestComponent";
import Dashboard3DL from "./3dlcomponents/Dashboard3DL";
import GridLayoutTester from "./content-components/GridLayoutTester";
import TabLayoutTester from "./content-components/TabLayoutTester";
import SingleTableLayoutTester from "./content-components/SingleTableLayoutTester";
import DataTaskHandler from "./ui-components/data-task-handler";
import Settings from "./ui-components/duft-settings/duft-settings";
import Login from "./ui-components/login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./ui-components/private-route";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<FlowbiteWrapper />}>
            {/* Handle redirects for '/' and '/home' */}
            <Route path="/" element={<Navigate to="/dashboard/home" />} />
            <Route path="/home" element={<Navigate to="/dashboard/home" />} />

            {/* Private Routes */}
            <Route path="*" element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
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
                <Route path="settings" element={<Settings />} />

                {/* Catch-all route for unavailable routes */}
                <Route path="*" element={<Navigate to="/dashboard/home" />} />
              </Route>
            </Route>

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
