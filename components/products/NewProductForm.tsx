import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Product } from "../../src/types/product";

interface NewProductFormProps {
  onSubmit: (
    productData: Omit<Product, "_id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const NewProductForm: React.FC<NewProductFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    barcode: "",
    supplier: "",
    minStock: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = "El ID del producto es requerido";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!formData.category.trim()) {
      newErrors.category = "La categoría es requerida";
    }

    if (formData.minStock < 0) {
      newErrors.minStock = "El stock mínimo no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const commonCategories = [
    "Electrónicos",
    "Ropa",
    "Hogar",
    "Deportes",
    "Libros",
    "Salud y Belleza",
    "Automóvil",
    "Juguetes",
    "Alimentación",
    "Otros",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="ID del Producto *"
          name="id"
          value={formData.id}
          onChange={handleChange}
          error={errors.id}
          placeholder="Ej: PROD001"
          disabled={isLoading}
        />

        <Input
          label="Código de Barras"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
          error={errors.barcode}
          placeholder="Opcional"
          disabled={isLoading}
        />
      </div>

      <Input
        label="Nombre del Producto *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Ingrese el nombre del producto"
        disabled={isLoading}
      />

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">
          Descripción *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.description ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Describe el producto..."
          rows={3}
          disabled={isLoading}
        />
        {errors.description && (
          <span className="mt-1 text-sm text-red-600">
            {errors.description}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Precio *"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="0.00"
          disabled={isLoading}
        />

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.category ? "border-red-500 focus:ring-red-500" : ""
            }`}
            disabled={isLoading}
          >
            <option value="">Seleccionar categoría</option>
            {commonCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="mt-1 text-sm text-red-600">{errors.category}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Stock Inicial"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          error={errors.stock}
          placeholder="0"
          disabled={isLoading}
        />

        <Input
          label="Stock Mínimo"
          name="minStock"
          type="number"
          min="0"
          value={formData.minStock}
          onChange={handleChange}
          error={errors.minStock}
          placeholder="0"
          disabled={isLoading}
        />
      </div>

      <Input
        label="Proveedor"
        name="supplier"
        value={formData.supplier}
        onChange={handleChange}
        error={errors.supplier}
        placeholder="Nombre del proveedor (opcional)"
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
};
