import { Model, Document, FilterQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";


export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T> {

  constructor(private model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async find(query: FilterQuery<T>): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findAll(query?: FilterQuery<T>): Promise<T[]> {
    return this.model.find(query ?? {}).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
