import { Router } from "express";
import { InterviewerRepository } from "../../../repositories/interviewer/InterviewerRepository";
import { InterviewerService } from "../../../services/interviewer/InterviewerService";
import { InterviewController } from "../../../controllers/interviewer/InterviewController";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/roles";
import { SlotGenerationRepository } from "../../../repositories/slot/slotGenerationRule/SlotGenerationRepository";
import { SlotService } from "../../../services/slot/SlotService";
import { InterviewSlotRepository } from "../../../repositories/slot/interviewSlot/InterviewSlotRepository";
const router=Router()

const interviewerRepository=new InterviewerRepository();
const interviewerService = new InterviewerService(interviewerRepository)

const slotGenerationRepository = new SlotGenerationRepository();
const interviewSlotRepository = new InterviewSlotRepository(); // Assuming you have an interview slot repository
const slotGenerationService = new SlotService(slotGenerationRepository,interviewSlotRepository);
const interviewerController=new InterviewController(interviewerService,slotGenerationService)


    router.get('/profile',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.getInterviewerProfile.bind(interviewerController))
    router.put('/profile',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.updateInterviewerProfile.bind(interviewerController))
    router.put('/change-password',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.changePassword.bind(interviewerController))
    router.post('/generate-slots',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.generateSlots.bind(interviewerController))
    router.get('/slots/:id',verifyToken,checkBlockedUser,checkRole([Roles.INTERVIEWER]),interviewerController.getSlotsByInterviewerId.bind(interviewerController))
    
export default router