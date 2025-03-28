import { Router } from "express";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { CompanyService } from "../../../services/company/CompanySerive";
import { CompanyController } from "../../../controllers/company/CompanyController";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { JobRepository } from "../../../repositories/job/JobRepository";
import { JobService } from "../../../services/job/JobService";
import { JobController } from "../../../controllers/job/JobController";
import { Roles } from "../../../constants/roles";
import { uploader } from "../../../middlewares/multer";
import Interviewer, { IInterviewer } from "../../../models/interviewer/Interviewer";
import { Candidate, Company } from "../../../models";
import { ICompany } from "../../../models/company/Company";
import { createResponse } from "../../../helper/responseHandler";
const router = Router();

const companyRepository = new CompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

const jobRespository = new JobRepository();
const jobService = new JobService(jobRespository);
const jobController = new JobController(jobService);

//company profile
router.get(
  "/profile",
  verifyToken,
  checkBlockedUser,
  checkRole(Roles.COMPANY),
  companyController.getCompanyById.bind(companyController)
);
router.put(
  "/profile",
  verifyToken,
  checkBlockedUser,
  checkRole(Roles.COMPANY),
  uploader.single("companyLogo"),
  companyController.updateCompanyProfile.bind(companyController)
);

//company interview Delegation routes

router.get(
  "/jobs",
  verifyToken,
  checkBlockedUser,
  checkRole(Roles.COMPANY),

  jobController.getAllJobs.bind(jobController)
);
router.post(
  "/jobs",
  verifyToken,
  checkBlockedUser,
  checkRole(Roles.COMPANY),
  jobController.createJob.bind(jobController)
);
router.put(
  "/jobs",
  verifyToken,
  checkBlockedUser,
  checkRole(Roles.COMPANY),
  jobController.updateJob.bind(jobController)
);
router.delete(
  "/jobs/:jobId",
  verifyToken,
  checkRole(Roles.COMPANY),
  jobController.deleteJob.bind(jobController)
);



export default router;
