export interface Category {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilters {
  search?: string;
}