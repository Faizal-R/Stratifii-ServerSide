import { Router } from "express";

import { uploader } from "../../../middlewares/multer";
import { resolve } from "../../../di";
import { ICandidateController } from "../../../controllers/candidate/ICandidateController";
import { DiControllers } from "../../../di/types";
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
  candidateController.getCandidateProfile.bind(candidateController)
);

export default router;
