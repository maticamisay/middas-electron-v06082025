export interface Supplier {
  _id?: string;
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierFilters {
  search?: string;
}