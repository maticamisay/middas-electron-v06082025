import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewProductForm } from "./NewProductForm";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Product } from "../../src/types/product";

export const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    productData: Omit<Product, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsLoading(true);

      // Crear el producto usando la API de Electron
      await (window as any).electronAPI.createProduct(productData);

      // Navegar de vuelta al dashboard con un mensaje de éxito
      navigate("/products", {
        state: { message: "Producto creado exitosamente" },
      });
    } catch (error) {
      console.error("Error creating product:", error);
      // Aquí podrías mostrar un toast o mensaje de error
      alert("Error al crear el producto. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crear Nuevo Producto
              </h1>
              <p className="mt-2 text-gray-600">
                Completa el formulario para agregar un nuevo producto al
                inventario
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al Dashboard
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <div className="p-6">
            <NewProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </Card>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            💡 Consejos para crear productos
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Usa un ID único y descriptivo para el producto</li>
            <li>
              • Incluye una descripción detallada para facilitar las búsquedas
            </li>
            <li>
              • Establece un stock mínimo para recibir alertas de inventario
              bajo
            </li>
            <li>
              • El código de barras es opcional pero útil para el escaneo rápido
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
