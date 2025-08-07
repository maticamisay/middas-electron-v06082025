import { Product, ProductFilters } from "./product";

declare global {
  interface Window {
    electronAPI: {
      createProduct: (
        productData: Omit<Product, "_id" | "id" | "createdAt" | "updatedAt">
      ) => Promise<Product>;
      getAllProducts: (filters?: ProductFilters) => Promise<Product[]>;
      getProductById: (id: string) => Promise<Product | null>;
      updateProduct: (
        id: string,
        updates: Partial<Product>
      ) => Promise<Product | null>;
      deleteProduct: (id: string) => Promise<boolean>;
      getProductStats: () => Promise<{
        total: number;
        lowStock: number;
        outOfStock: number;
        totalValue: number;
        categories: string[];
      }>;
      getLowStockProducts: () => Promise<Product[]>;
    };
  }
}

export {};
