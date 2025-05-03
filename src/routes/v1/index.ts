import { Router } from "express";
import adminRoutes from './admin/AdminRoutes'
import interviewerRoutes from "./interviewer/InterviewerRoutes";
import candidateRoutes from './candidate/CandidateRoutes'
import companyRoutes from './company/CompanyRoutes'
import authRoutes from './auth/AuthRoutes'
import { checkRole, verifyToken } from "../../middlewares/Auth";
import paymentRoutes from "./payment/PaymentRoutes";
import { Roles } from "../../constants/roles";
import subscriptionRoutes from "./subscription/SubscriptionRoutes";
import { checkBlockedUser } from "../../middlewares/checkBlockedUser";

const router = Router();

// Role-based routing
router.use("/admin/", adminRoutes);
router.use("/interviewer",verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]), interviewerRoutes);
router.use("/candidate", candidateRoutes);
router.use('/company',verifyToken,checkBlockedUser,checkRole([Roles.COMPANY]),companyRoutes)
router.use('/auth',authRoutes)
router.use('/payment',verifyToken,checkBlockedUser,checkRole([Roles.COMPANY]),paymentRoutes)
router.use('/subscription',verifyToken,subscriptionRoutes)



export default router;
