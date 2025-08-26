import { Router } from "express";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/enums/roles";
import { resolve } from "../../../di";
import { IInterviewerController } from "../../../controllers/interviewer/IInterviewerController";
import { DI_TOKENS } from "../../../di/types";
import { uploader } from "../../../middlewares/multer";
import { ISlotController } from "../../../controllers/slot/ISlotController";
const router = Router();

const interviewerController = resolve<IInterviewerController>(
  DI_TOKENS.CONTROLLERS.INTERVIEWER_CONTROLLER
);
const slotController = resolve<ISlotController>(DI_TOKENS.CONTROLLERS.SLOT_CONTROLLER);

router.get(
  "/profile",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  interviewerController.getInterviewerProfile.bind(interviewerController)
);
router.put(
  "/profile",
  verifyToken,
  checkBlockedUser,
uploader.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]),
  checkRole([Roles.INTERVIEWER]),
  interviewerController.updateInterviewerProfile.bind(interviewerController)
);
router.put(
  "/change-password",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  interviewerController.changePassword.bind(interviewerController)
);
router.post(
  "/generate-slots",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  slotController.createSlotGenerationRule.bind(interviewerController)
);
router.get(
  "/slot-generation-rule/:interviewerId",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  slotController.getInterviewerSlotGenerationRule.bind(interviewerController)
);
router.get(
  "/slots/:id",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  slotController.getSlotsByRule.bind(interviewerController)
);
router.put(
  "/slot-generation-rule/:interviewerId",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  slotController.updateInterviewerSlotGenerationRule.bind(interviewerController)
);


router.get("/upcoming-interviews",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  interviewerController.getUpcomingInterviews.bind(interviewerController))

export default router;
