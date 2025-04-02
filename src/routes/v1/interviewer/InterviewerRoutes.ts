import { Router } from "express";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { InterviewerService } from "../../../services/interviewer/InterviewerService";
import { InterviewController } from "../../../controllers/interviewer/InterviewController";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/roles";
const router=Router()

const interviewerRepository=new InterviewerRepository();
const interviewerService = new InterviewerService(interviewerRepository)
const interviewerController=new InterviewController(interviewerService)


    router.get('/profile',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.getInterviewerProfile.bind(interviewerController))
    router.put('/profile',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.updateInterviewerProfile.bind(interviewerController))

export default router