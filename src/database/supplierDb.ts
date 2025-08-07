import { app } from "electron";
import * as path from "path";
import Datastore from "@seald-io/nedb";
import { v4 as uuidv4 } from "uuid";
import { Supplier, SupplierFilters } from "../types/supplier";

class SupplierDatabase {
  private db: Datastore<Supplier>;

  constructor() {
    const userDataPath = app.getPath("userData");
    const dbPath = path.join(userDataPath, "suppliers.db");

    this.db = new Datastore<Supplier>({
      filename: dbPath,
      autoload: true,
    });

    this.db.ensureIndex({ fieldName: "id", unique: true });
    this.db.ensureIndex({ fieldName: "name", unique: true });
    this.db.ensureIndex({ fieldName: "email", sparse: true });
  }

  async createSupplier(
    supplierData: Omit<Supplier, "_id" | "id" | "createdAt" | "updatedAt">
  ): Promise<Supplier> {
    const now = new Date();
    const supplier: Supplier = {
      id: uuidv4(),
      ...supplierData,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve, reject) => {
      this.db.insert(supplier, (err, newSupplier) => {
        if (err) reject(err);
        else resolve(newSupplier);
      });
    });
  }

  async getAllSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
    return new Promise((resolve, reject) => {
      let query: any = {};

      if (filters?.search) {
        query.$or = [
          { name: new RegExp(filters.search, "i") },
          { contactPerson: new RegExp(filters.search, "i") },
          { email: new RegExp(filters.search, "i") },
        ];
      }

      this.db
        .find(query)
        .sort({ name: 1 })
        .exec((err, suppliers) => {
          if (err) reject(err);
          else resolve(suppliers);
        });
    });
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ id }, (err, supplier) => {
        if (err) reject(err);
        else resolve(supplier);
      });
    });
  }

  async updateSupplier(
    id: string,
    updates: Partial<Supplier>
  ): Promise<Supplier | null> {
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
          else resolve(updatedDoc as Supplier);
        }
      );
    });
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.remove({ id }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved > 0);
      });
    });
  }

  async getSupplierByName(name: string): Promise<Supplier | null> {
    return new Promise((resolve, reject) => {
      this.db.findOne({ name }, (err, supplier) => {
        if (err) reject(err);
        else resolve(supplier);
      });
    });
  }
}

export default SupplierDatabase;