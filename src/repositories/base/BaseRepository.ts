import { Model, Document, FilterQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  find(query: FilterQuery<T>): Promise<T[]> {
    return this.model.find(query??{}).exec();
  }

  findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  // findAll(query?: FilterQuery<T>): Promise<T[]> {
  //   return this.model.find(query ?? {}).exec();
  // }

  update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
