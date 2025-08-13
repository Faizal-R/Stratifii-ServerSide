import { Router } from "express";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/roles";
import { resolve } from "../../../di";

import { DiControllers } from "../../../di/types";
import { IInterviewController } from "../../../controllers/interview/IInterviewController";


const router = Router();

const interviewController = resolve<IInterviewController>(
  DiControllers.InterviewController
);

router.put(
  "/update-with-feedback/:id",
  interviewController.updateAndSubmitFeedback.bind(interviewController)
);

router.get("/:id/scheduled-interviews",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.CANDIDATE]),
  interviewController.getScheduledInterviews.bind(interviewController)
);

export default router;
