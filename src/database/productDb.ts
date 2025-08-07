import { app } from 'electron';
import * as path from 'path';
import Datastore from '@seald-io/nedb';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductFilters, ProductStats } from '../types/product';

class ProductDatabase {
  private db: Datastore<Product>;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'products.db');
    
    this.db = new Datastore<Product>({
      filename: dbPath,
      autoload: true,
    });

    // Crear índices para mejor rendimiento
    this.db.ensureIndex({ fieldName: 'id', unique: true });
    this.db.ensureIndex({ fieldName: 'name' });
    this.db.ensureIndex({ fieldName: 'category' });
    this.db.ensureIndex({ fieldName: 'barcode', sparse: true });
  }

  async createProduct(productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: uuidv4(),
      ...productData,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      this.db.insert(product, (err, newProduct) => {
        if (err) reject(err);
        else resolve(newProduct);
      });
    });
  }

  async getAllProducts(filters?: ProductFilters): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      let query: any = {};

      if (filters) {
        if (filters.search) {
          query.$or = [
            { name: new RegExp(filters.search, 'i') },
            { description: new RegExp(filters.search, 'i') },
            { barcode: new RegExp(filters.search, 'i') },
          ];
        }
        
        if (filters.category) {
          query.category = filters.category;
        }

        if (filters.minStock !== undefined) {
          query.stock = { ...query.stock, $gte: filters.minStock };
        }

        if (filters.maxStock !== undefined) {
          query.stock = { ...query.stock, $lte: filters.maxStock };
        }

        if (filters.minPrice !== undefined) {
          query.price = { ...query.price, $gte: filters.minPrice };
        }

        if (filters.maxPrice !== undefined) {
          query.price = { ...query.price, $lte: filters.maxPrice };
        }
      }

      this.db.find(query).sort({ updatedAt: -1 }).exec((err, products) => {
        if (err) reject(err);
        else resolve(products);
      });
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, (err, product) => {
        if (err) reject(err);
        else resolve(product);
      });
    });
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      this.db.update(
        { id },
        { $set: updateData },
        { returnUpdatedDocs: true },
        (err, numReplaced, updatedDoc) => {
          if (err) reject(err);
          else if (numReplaced === 0) resolve(null);
          else resolve(updatedDoc as Product);
        }
      );
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.remove({ id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved > 0);
      });
    });
  }

  async getProductStats(): Promise<ProductStats> {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err: Error | null, products: Product[]) => {
        if (err) {
          reject(err);
          return;
        }

        const stats: ProductStats = {
          total: products.length,
          lowStock: products.filter((p: Product) => p.stock <= p.minStock && p.stock > 0).length,
          outOfStock: products.filter((p: Product) => p.stock === 0).length,
          totalValue: products.reduce((sum: number, p: Product) => sum + (p.price * p.stock), 0),
          categories: [...new Set(products.map((p: Product) => p.category))].sort() as string[],
        };

        resolve(stats);
      });
    });
  }

  async getLowStockProducts(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      this.db.find({
        $or: [
          { stock: { $lte: '$minStock', $gt: 0 } },
          { stock: 0 }
        ]
      }).sort({ stock: 1 }).exec((err, products) => {
        if (err) reject(err);
        else resolve(products);
      });
    });
  }
}

export default ProductDatabase;