import { Router } from "express";

import { uploader } from "../../../middlewares/multer";
import { resolve } from "../../../di";
import { ICandidateController } from "../../../controllers/candidate/ICandidateController";
import { DiControllers } from "../../../di/types";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { Roles } from "../../../constants/roles";
const router = Router();

const candidateController = resolve<ICandidateController>(
  DiControllers.CandidateController
);

router.post(
  "/setup",
  uploader.single("candidateAvatar"),
  candidateController.setupCandidateProfile.bind(candidateController)
);
router.get(
  "/profile/:id",
  verifyToken,
  checkRole([Roles.CANDIDATE]),
  candidateController.getCandidateProfile.bind(candidateController)
);

router.get(
  "/delegated-jobs",
  verifyToken,
  checkRole([Roles.CANDIDATE]),
  candidateController.getDelegatedJobs.bind(candidateController)
);
router.get(
  "/mock-interview/questions/:id",
  verifyToken,
  checkRole([Roles.CANDIDATE]),
  candidateController.generateCandidateMockInterviewQuestions.bind(
    candidateController
  )
);

router.put(
  "/mock-interview/submit-result",
  verifyToken,
  checkRole([Roles.CANDIDATE]),
  candidateController.finalizeAIMockInterview.bind(candidateController)
);


export default router;
