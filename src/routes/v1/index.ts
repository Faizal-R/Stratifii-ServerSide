import { Router } from "express";
import adminRoutes from './admin/AdminRoutes'
import interviewerRoutes from "./interviewer/InterviewerRoutes";
import candidateRoutes from './candidate/CandidateRoutes'
import companyRoutes from './company/CompanyRoutes'

const router = Router();

// Role-based routing
router.use("/admin", adminRoutes);
router.use("/interviewer", interviewerRoutes);
router.use("/candidate", candidateRoutes);
router.use('/company',companyRoutes)


export default router;
