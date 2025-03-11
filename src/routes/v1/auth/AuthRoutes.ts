import { Router } from "express";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { CandidateRepository } from "../../../repositories/candidate/CandidateRepository";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { AuthService } from "../../../services/auth/AuthService";
import { AuthController } from "../../../controllers/auth/AuthController";
import { OtpRepository } from "../../../repositories/auth/OtpRepository";
import {AdminRepository} from '../../../repositories/admin/AdminRepository'
const router = Router();
import redis from '../../../config/RedisConfig'

const interviwerRepository = new InterviewerRepository();
const candidateRepository = new CandidateRepository();
const companyRepository = new CompanyRepository();
const otpRepository=new OtpRepository(redis)

const authService = new AuthService(
    interviwerRepository,
    candidateRepository,
    companyRepository,
    otpRepository,

);

const authController = new AuthController(authService);

router.post("/signin", authController.login.bind(authController));
router.post('/register/company',authController.registerCompany.bind(authController))
router.post('/register/interviewer',authController.registerInterviewer.bind(authController))
router.post('/otp/verify',authController.authenticateOTP.bind(authController))
router.post('/otp/resend',authController.triggerOtpResend.bind(authController))

router.post('/google',authController.googleAuthentication.bind(authController))



export default router
