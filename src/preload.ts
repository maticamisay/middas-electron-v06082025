// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { Product, ProductFilters } from './types/product';

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
    };
  }
}
