import { Router } from "express";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { InterviewerService } from "../../../services/interviewer/InterviewerService";
import { InterviewController } from "../../../controllers/interviewer/InterviewController";
const router=Router()

const interviewerRepository=new InterviewerRepository();
const interviewerService = new InterviewerService(interviewerRepository)
const interviewerController=new InterviewController(interviewerService)

router.post('/login',interviewerController.login.bind(interviewerController))
router.post('/register',interviewerController.register.bind(interviewerController))


export default router