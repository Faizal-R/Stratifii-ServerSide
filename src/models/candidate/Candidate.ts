import mongoose, { Schema, Document } from "mongoose";


export interface ICandidate extends Document {
  email: string;
  password: string;
  name: string;
  //   resume: string;
  status?: string;
}

const CandidateSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // resume: {
    //   type: String,
    //   required: false,
    // },
    status: {
      type: String,
      required: true,
      enum:["active","pending"]
    },
  },
  {
    timestamps: true,
  }
);

const Candidate=mongoose.model<ICandidate>("Candidate",CandidateSchema)
export default Candidate