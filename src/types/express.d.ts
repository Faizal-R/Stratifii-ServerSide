// types/express.d.ts
import { TokenPayload } from "../middlewares/Auth";
import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      file?: Multer.File;
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}

export {};
