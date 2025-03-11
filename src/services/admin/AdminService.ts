import { hash } from "bcryptjs";
import {IAdminRepository} from "../../repositories/admin/IAdminRepository";
import { IAdminService } from "./IAdminService";
import { comparePassword } from "../../utils/hash";
import { IAdmin } from "../../models/admin/Admin";
import { CustomError } from "../../error/CustomError";
import { HttpStatus } from "../../config/HttpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helper/generateTokens";
import { Roles } from "../../constants/roles";

export class AdminService implements IAdminService {
  constructor(private readonly _adminRepository: IAdminRepository) {}

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      let admin = await this._adminRepository.findByEmail(email);

      if (!admin || (await comparePassword(password, admin.password))) {
        throw new CustomError(
          "Invalid email or password",
          HttpStatus.BAD_REQUEST
        );
      }
      const accessToken = await generateAccessToken(
        admin._id as string,
        Roles.ADMIN
      );
      const refreshToken = await generateRefreshToken(
        admin._id as string,
        Roles.ADMIN
      );
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
