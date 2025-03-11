import { Router } from "express";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { InterviewerService } from "../../../services/interviewer/InterviewerService";
import { InterviewController } from "../../../controllers/interviewer/InterviewController";
import { verifyToken } from "../../../middlewares/Auth";
const router=Router()

const interviewerRepository=new InterviewerRepository();
const interviewerService = new InterviewerService(interviewerRepository)
const interviewerController=new InterviewController(interviewerService)


router.get('/profile',verifyToken,interviewerController.getInterviewerProfile.bind(interviewerController))
router.put('/profile',verifyToken,interviewerController.updateInterviewerProfile.bind(interviewerController))

export default router