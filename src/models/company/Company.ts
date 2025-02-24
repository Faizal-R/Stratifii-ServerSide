import mongoose, {Schema, Document, ObjectId } from "mongoose";
import { ICompany } from "../../interfaces/ICompanyModel";

const CompanySchema: Schema = new Schema(
    {
      companyName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      companyWebsite: {
        type: String,
        required: true,
        trim: true,
      },
      registrationCertificateNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      linkedInProfile: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      companyType: {
        type: String,
        required: true,
      },
      candidates: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Candidate", 
        },
      ],
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true, 
    }
  );
  
  const Company=mongoose.model<ICompany>("Company", CompanySchema); 

  export default Company