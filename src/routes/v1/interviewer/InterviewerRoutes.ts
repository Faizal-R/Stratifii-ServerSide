import { Router } from "express";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/roles";
import { resolve } from "../../../di";
import { IInterviewerController } from "../../../controllers/interviewer/IInterviewerController";
import { DiControllers } from "../../../di/types";
const router = Router();

const interviewerController = resolve<IInterviewerController>(
 DiControllers.InterviewerController
);

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
  interviewerController.generateSlots.bind(interviewerController)
);
router.get(
  "/slots/:id",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  interviewerController.getSlotsByInterviewerId.bind(interviewerController)
);

export default router;
