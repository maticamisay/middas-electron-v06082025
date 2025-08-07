import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Table } from "../ui/Table";
import { Modal } from "../ui/Modal";
import { Category, CategoryFilters } from "../../src/types/category";

export const CategoryDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [categories, filters]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...categories];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          (category.description &&
            category.description.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredCategories(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description || undefined,
      };

      if (editingCategory) {
        await window.electronAPI.updateCategory(editingCategory.id, categoryData);
      } else {
        await window.electronAPI.createCategory(categoryData);
      }

      await loadCategories();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error al guardar la categoría. Verifica que el nombre sea único.");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"? Los productos con esta categoría se marcarán como "Sin categoría".`)) {
      try {
        await window.electronAPI.deleteCategory(category.id);
        await loadCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error al eliminar la categoría.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingCategory(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    { key: "name", label: "Nombre" },
    { 
      key: "description", 
      label: "Descripción",
      render: (value: string) => value || "Sin descripción"
    },
    {
      key: "createdAt",
      label: "Fecha de creación",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_: any, item: Category) => (
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
        <div className="text-lg">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Categorías
          </h1>
          <p className="text-gray-600">Administra las categorías de productos</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categorías ({filteredCategories.length})</h2>
              <Button onClick={() => setIsModalOpen(true)}>
                Agregar Categoría
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar categorías..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table data={filteredCategories} columns={columns} />
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingCategory ? "Editar Categoría" : "Agregar Categoría"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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
                Descripción
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción opcional de la categoría..."
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
                {editingCategory ? "Actualizar" : "Crear"} Categoría
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};