import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProductDashboard } from "../components/products/ProductDashboard";
import { NewProductPage } from "../components/products/NewProductPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductDashboard />} />
          <Route path="/products" element={<ProductDashboard />} />
          <Route path="/products/new" element={<NewProductPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
