import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Table } from "../ui/Table";
import { Modal } from "../ui/Modal";
import { Supplier, SupplierFilters } from "../../src/types/supplier";

export const SupplierDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [suppliers, filters]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await window.electronAPI.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Error loading suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm) ||
          (supplier.contactPerson &&
            supplier.contactPerson.toLowerCase().includes(searchTerm)) ||
          (supplier.email &&
            supplier.email.toLowerCase().includes(searchTerm))
      );
    }

    setFilteredSuppliers(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supplierData = {
        name: formData.name,
        contactPerson: formData.contactPerson || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      };

      if (editingSupplier) {
        await window.electronAPI.updateSupplier(editingSupplier.id, supplierData);
      } else {
        await window.electronAPI.createSupplier(supplierData);
      }

      await loadSuppliers();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Error al guardar el proveedor. Verifica que el nombre sea único.");
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (confirm(`¿Estás seguro de eliminar el proveedor "${supplier.name}"? Se eliminará la referencia de todos los productos asociados.`)) {
      try {
        await window.electronAPI.deleteSupplier(supplier.id);
        await loadSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Error al eliminar el proveedor.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
    setEditingSupplier(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const columns = [
    { key: "name", label: "Nombre" },
    { 
      key: "contactPerson", 
      label: "Contacto",
      render: (value: string) => value || "No especificado"
    },
    { 
      key: "email", 
      label: "Email",
      render: (value: string) => value || "No especificado"
    },
    { 
      key: "phone", 
      label: "Teléfono",
      render: (value: string) => value || "No especificado"
    },
    {
      key: "createdAt",
      label: "Fecha de creación",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_: any, item: Supplier) => (
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
        <div className="text-lg">Cargando proveedores...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Proveedores
          </h1>
          <p className="text-gray-600">Administra los proveedores de productos</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Proveedores ({filteredSuppliers.length})</h2>
              <Button onClick={() => setIsModalOpen(true)}>
                Agregar Proveedor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar proveedores..."
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
            <Table data={filteredSuppliers} columns={columns} />
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingSupplier ? "Editar Proveedor" : "Agregar Proveedor"}
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
              <Input
                label="Persona de contacto"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Dirección
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Dirección del proveedor..."
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
                {editingSupplier ? "Actualizar" : "Crear"} Proveedor
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};