import { FilterQuery } from "mongoose";

export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(query?:FilterQuery<T>): Promise<T[]|[]>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    find(query: FilterQuery<T>): Promise<T[]>

  }
  