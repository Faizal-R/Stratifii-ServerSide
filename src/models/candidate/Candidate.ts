import mongoose, { Schema, Document } from "mongoose";
import { ICandidate } from "../../interfaces/ICandidateModel";



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
      enum:[""]
    },
  },
  {
    timestamps: true,
  }
);

const Candidate=mongoose.model<ICandidate>("Candidate",CandidateSchema)
export default Candidate