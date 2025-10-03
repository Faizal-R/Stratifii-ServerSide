import { Router } from "express";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { Roles } from "../../../constants/enums/roles";
import { resolve } from "../../../di";

import { DI_TOKENS } from "../../../di/types";
import { IInterviewController } from "../../../controllers/interview/IInterviewController";


const router = Router();

const interviewController = resolve<IInterviewController>(
  DI_TOKENS.CONTROLLERS.INTERVIEW_CONTROLLER
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

router.get('/candidate/:candidateId',verifyToken,
  checkBlockedUser,
  checkRole([Roles.INTERVIEWER]),
  interviewController.getAllInterviewsByCandidateId.bind(interviewController))

  router.patch("/complete-process/:delegatedCandidateId",
  verifyToken,
  checkBlockedUser,
  checkRole([Roles.COMPANY]),
  interviewController.completeCandidateInterviewProcess.bind(interviewController)
)

export default router;
