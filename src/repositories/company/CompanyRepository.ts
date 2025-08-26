import { ICompany } from "../../models/company/Company";
import { Company } from "../../models";
import { BaseRepository } from "../base/BaseRepository";
import { ICompanyRepository } from "./ICompanyRepository";
import { injectable } from "inversify";

@injectable()
export class CompanyRepository
  extends BaseRepository<ICompany>
  implements ICompanyRepository
{
  constructor() {
    super(Company);
  }

  async findByEmail(email: string): Promise<ICompany | null> {
    const company = await this.model.findOne({ email }).exec();
    return company ;
  }
}
