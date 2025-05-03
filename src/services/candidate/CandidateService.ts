import { HttpStatus } from "../../config/HttpStatusCodes";
import redis from "../../config/RedisConfig";
import { ERROR_MESSAGES } from "../../constants/messages/ErrorMessages";
import { CustomError } from "../../error/CustomError";
import { uploadOnCloudinary } from "../../helper/cloudinary";
import { TokenPayload } from "../../middlewares/Auth";
import { ICandidate } from "../../models/candidate/Candidate";
import { ICandidateRepository } from "../../repositories/candidate/ICandidateRepository";
import { comparePassword, hashPassword } from "../../utils/hash";
import { ICandidateService } from "./ICandidateService";
import jwt from "jsonwebtoken";

export class CandidateService implements ICandidateService {
  constructor(private readonly _candidateRepository: ICandidateRepository) {}
  async setupCandiateProfile(
    avatar: Express.Multer.File,
    password: string,
    token: string
  ): Promise<ICandidate | null> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as TokenPayload;
      console.log(decoded)
      const userId = decoded.userId;
      
      const storedToken = await redis.get(`createPasswordToken:${userId}`);

       console.log(storedToken)

      if (!storedToken || storedToken !== token) {
        throw new CustomError(
          "Invalid or expired token",
          HttpStatus.BAD_REQUEST
        );
      }
      const hashedPassword = await hashPassword(password);
      const avatarUrl = await uploadOnCloudinary(avatar.path);
      const candidate = await this._candidateRepository.update(userId, {
        password: hashedPassword,
        avatar: avatarUrl,
      });

      return candidate;
    } catch (error) {
      console.log(error)
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
