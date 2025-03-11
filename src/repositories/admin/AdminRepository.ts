import Admin, { IAdmin } from "../../models/admin/Admin";
import { BaseRepository } from "../base/BaseRepository";
import {IAdminRepository} from "./IAdminRepository";

export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async findByEmail(email: string) {
    return Admin.findOne({ email }).exec();
  }
}
