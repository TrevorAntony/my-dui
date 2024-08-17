import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import ComponentA from './content-components/ComponentA';
import ComponentB from './content-components/ComponentB';
import ComponentC from './content-components/ComponentC';
import './App.css';
import SamplePage from './pages';
import FlowbiteWrapper from './components/flowbite-wrapper';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<FlowbiteWrapper />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="a/:id?" element={<ComponentA />} /> 
          <Route path="b" element={<ComponentB />} />
          <Route path="c" element={<ComponentC />} />
        </Route>
        <Route path="s" element={<SamplePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;