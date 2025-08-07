import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductDashboard } from '../components/ProductDashboard';

export default function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
        </Routes>
      </Router>
    );
  }