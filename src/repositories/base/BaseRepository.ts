import { Model, Document, FilterQuery,UpdateQuery } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  constructor(protected model: Model<T>) {}

  create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  find(query: FilterQuery<T>, limit?: number,sort?:FilterQuery<T>): Promise<T[]> {
    return this.model.find(query??{}).limit(limit??100).sort(sort??{createdAt:1}).exec();
  }

  findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  update(id: string, query: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, query, { new: true }).exec();
  }

  delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
