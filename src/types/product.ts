export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  supplier?: string;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  categories: string[];
}