import { ICompanyService } from "./ICompanyService";
import { CompanyRepository } from "../../repositories/company/CompanyRepository";
import { ICompany } from "../../interfaces/ICompanyModel";
import { comparePassword, hashPassword } from "../../utils/hash";
import { Document } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../../helper/generateTokens";

export class CompanyService implements ICompanyService {
  constructor(private _companyRepository: CompanyRepository) {}
  /**
   * Authenticating a User
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<ICompany>}
   */
    async login(
      email: string,
      password: string
    ): Promise<{
      accessToken: string;
      refreshToken: string;
      user: ICompany;
    }> {
      const user = await this._companyRepository.findByEmail(email);
      if (!user) {
        throw new Error("Invalid email or password");
      }
      // Compare passwords
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }
      const accessToken = generateAccessToken(user._id as string);
      const refreshToken = generateRefreshToken(user._id as string);
      return { accessToken, refreshToken, user };
    }
  async register(
    companyName: string,
    email: string,
    companyWebsite: string,
    registrationCertificateNumber: string,
    linkedInProfile: string,
    phone: string,
    password: string,
    companyType: string
  ): Promise<ICompany> {
    const existingUser = await this._companyRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use");
    }
    let hashedPassword = await hashPassword(password);

    type companyInput = Omit<ICompany, keyof Document>;

    const newCompany: companyInput = {
      companyName,
      email,
      companyWebsite,
      registrationCertificateNumber,
      linkedInProfile,
      phone,
      password: hashedPassword,
      companyType,
    };
    return await this._companyRepository.create(newCompany)
  }
}
