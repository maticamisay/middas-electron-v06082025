import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Table } from "../ui/Table";
import { Modal } from "../ui/Modal";
import { Product, ProductFilters } from "../../src/types/product";
import { Category } from "../../src/types/category";
import { Supplier } from "../../src/types/supplier";

export const ProductDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    barcode: "",
    supplier: "",
    minStock: "",
  });

  useEffect(() => {
    loadProducts();
    loadStats();
    loadCategoriesAndSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await window.electronAPI.getProductStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadCategoriesAndSuppliers = async () => {
    try {
      const [categoriesData, suppliersData] = await Promise.all([
        window.electronAPI.getAllCategories(),
        window.electronAPI.getAllSuppliers()
      ]);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading categories and suppliers:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          (product.barcode &&
            product.barcode.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        barcode: formData.barcode || undefined,
        supplier: formData.supplier || undefined,
        minStock: parseInt(formData.minStock),
      };

      if (editingProduct) {
        await window.electronAPI.updateProduct(editingProduct.id, productData);
      } else {
        await window.electronAPI.createProduct(productData);
      }

      await loadProducts();
      await loadStats();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      barcode: product.barcode || "",
      supplier: product.supplier || "",
      minStock: product.minStock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      try {
        await window.electronAPI.deleteProduct(product.id);
        await loadProducts();
        await loadStats();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      barcode: "",
      supplier: "",
      minStock: "",
    });
    setEditingProduct(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "category", label: "Categoría" },
    {
      key: "price",
      label: "Precio",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number, item: Product) => (
        <span
          className={value <= item.minStock ? "text-red-600 font-semibold" : ""}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_: any, item: Product) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleEdit(item)}
          >
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Productos
          </h1>
          <p className="text-gray-600">Administra tu inventario de productos</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Productos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.totalValue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Valor Inventario</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.lowStock}
                </div>
                <div className="text-sm text-gray-600">Stock Bajo</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.outOfStock}
                </div>
                <div className="text-sm text-gray-600">Sin Stock</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Productos</h2>
              <Button onClick={() => navigate("/products/new")}>
                Agregar Producto
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Buscar productos..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.category || ""}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={() => setFilters({})}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table data={filteredProducts} columns={columns} />
          </CardContent>
        </Card>

        {/* Add/Edit Product Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingProduct ? "Editar Producto" : "Agregar Producto"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Categoría *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Precio *"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <Input
                label="Stock *"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
              />
              <Input
                label="Stock Mínimo *"
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({ ...formData, minStock: e.target.value })
                }
                required
              />
              <Input
                label="Código de Barras"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({ ...formData, barcode: e.target.value })
                }
              />
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Proveedor
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                >
                  <option value="">Seleccionar proveedor (opcional)</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleModalClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingProduct ? "Actualizar" : "Crear"} Producto
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
