import { app } from "electron";
import * as path from "path";
import Datastore from "@seald-io/nedb";
import { v4 as uuidv4 } from "uuid";
import { Category, CategoryFilters } from "../types/category";

class CategoryDatabase {
  private db: Datastore<Category>;

  constructor() {
    const userDataPath = app.getPath("userData");
    const dbPath = path.join(userDataPath, "categories.db");

    this.db = new Datastore<Category>({
      filename: dbPath,
      autoload: true,
    });

    this.db.ensureIndex({ fieldName: "id", unique: true });
    this.db.ensureIndex({ fieldName: "name", unique: true });
  }

  async createCategory(
    categoryData: Omit<Category, "_id" | "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    const now = new Date();
    const category: Category = {
      id: uuidv4(),
      ...categoryData,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      this.db.insert(category, (err, newCategory) => {
        if (err) reject(err);
        else resolve(newCategory);
      });
    });
  }

  async getAllCategories(filters?: CategoryFilters): Promise<Category[]> {
    return new Promise((resolve, reject) => {
      let query: any = {};

      if (filters?.search) {
        query.$or = [
          { name: new RegExp(filters.search, "i") },
          { description: new RegExp(filters.search, "i") },
        ];
      }

      this.db
        .find(query)
        .sort({ name: 1 })
        .exec((err, categories) => {
          if (err) reject(err);
          else resolve(categories);
        });
    });
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, (err, category) => {
        if (err) reject(err);
        else resolve(category);
      });
    });
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
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
          else resolve(updatedDoc as Category);
        }
      );
    });
  }

  async deleteCategory(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.remove({ id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved > 0);
      });
    });
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ name }, (err, category) => {
        if (err) reject(err);
        else resolve(category);
      });
    });
  }
}

export default CategoryDatabase;