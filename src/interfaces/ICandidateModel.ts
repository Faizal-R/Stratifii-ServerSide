import { Document } from "mongoose";
export interface ICandidate extends Document {
  email: string;
  password: string;
  name: string;
  //   resume: string;
  status?: string;
}
