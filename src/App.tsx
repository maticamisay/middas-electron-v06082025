import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductDashboard } from '../components/products/ProductDashboard';
import { NewProductPage } from '../components/products/NewProductPage';

export default function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/products" element={<ProductDashboard />} />
          <Route path="/products/new" element={<NewProductPage />} />
        </Routes>
      </Router>
    );
  }