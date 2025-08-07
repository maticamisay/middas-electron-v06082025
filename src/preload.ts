// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { Product, ProductFilters } from './types/product';
import { Category, CategoryFilters } from './types/category';
import { Supplier, SupplierFilters } from './types/supplier';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Product operations
  createProduct: (productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>) =>
    ipcRenderer.invoke('product:create', productData),
  
  getAllProducts: (filters?: ProductFilters) =>
    ipcRenderer.invoke('product:getAll', filters),
  
  getProductById: (id: string) =>
    ipcRenderer.invoke('product:getById', id),
  
  updateProduct: (id: string, updates: Partial<Product>) =>
    ipcRenderer.invoke('product:update', id, updates),
  
  deleteProduct: (id: string) =>
    ipcRenderer.invoke('product:delete', id),
  
  getProductStats: () =>
    ipcRenderer.invoke('product:getStats'),
  
  getLowStockProducts: () =>
    ipcRenderer.invoke('product:getLowStock'),

  // Category operations
  createCategory: (categoryData: Omit<Category, '_id' | 'id' | 'createdAt' | 'updatedAt'>) =>
    ipcRenderer.invoke('category:create', categoryData),
  
  getAllCategories: (filters?: CategoryFilters) =>
    ipcRenderer.invoke('category:getAll', filters),
  
  getCategoryById: (id: string) =>
    ipcRenderer.invoke('category:getById', id),
  
  updateCategory: (id: string, updates: Partial<Category>) =>
    ipcRenderer.invoke('category:update', id, updates),
  
  deleteCategory: (id: string) =>
    ipcRenderer.invoke('category:delete', id),

  // Supplier operations
  createSupplier: (supplierData: Omit<Supplier, '_id' | 'id' | 'createdAt' | 'updatedAt'>) =>
    ipcRenderer.invoke('supplier:create', supplierData),
  
  getAllSuppliers: (filters?: SupplierFilters) =>
    ipcRenderer.invoke('supplier:getAll', filters),
  
  getSupplierById: (id: string) =>
    ipcRenderer.invoke('supplier:getById', id),
  
  updateSupplier: (id: string, updates: Partial<Supplier>) =>
    ipcRenderer.invoke('supplier:update', id, updates),
  
  deleteSupplier: (id: string) =>
    ipcRenderer.invoke('supplier:delete', id),
});

// Add type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      createProduct: (productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
      getAllProducts: (filters?: ProductFilters) => Promise<Product[]>;
      getProductById: (id: string) => Promise<Product | null>;
      updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
      deleteProduct: (id: string) => Promise<boolean>;
      getProductStats: () => Promise<any>;
      getLowStockProducts: () => Promise<Product[]>;
      // Category operations
      createCategory: (categoryData: Omit<Category, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<Category>;
      getAllCategories: (filters?: CategoryFilters) => Promise<Category[]>;
      getCategoryById: (id: string) => Promise<Category | null>;
      updateCategory: (id: string, updates: Partial<Category>) => Promise<Category | null>;
      deleteCategory: (id: string) => Promise<boolean>;
      // Supplier operations
      createSupplier: (supplierData: Omit<Supplier, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<Supplier>;
      getAllSuppliers: (filters?: SupplierFilters) => Promise<Supplier[]>;
      getSupplierById: (id: string) => Promise<Supplier | null>;
      updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<Supplier | null>;
      deleteSupplier: (id: string) => Promise<boolean>;
    };
  }
}
