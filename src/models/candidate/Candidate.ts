import mongoose, { Schema, Document, Types } from "mongoose";
import { ICompany } from "../company/Company";


export interface ICandidate extends Document {
  
  companyId:Types.ObjectId | ICompany
  email: string;
  password?: string;
  name: string;
  resume: string;
  avatar?:string;
  status?: string;
  isBlocked?:boolean;
  
}

const CandidateSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,

    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    resume: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum:["active","pending","deactive"]
    },

    isBlocked:{
      type:Boolean,
      default:false
    },
    companyId:{
      type:Schema.Types.ObjectId,
      ref:"Company",
      required:true
    }
  },
  {
    timestamps: true,
  }
);

const Candidate=mongoose.model<ICandidate>("Candidate",CandidateSchema)
export default Candidate