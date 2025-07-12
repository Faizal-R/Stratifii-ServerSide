import { Router } from "express";

const router = Router();
import { checkBlockedUser } from "../../../middlewares/checkBlockedUser";
import { uploader } from "../../../middlewares/multer";

import { resolve } from "../../../di";
import { DI_CONTROLLERS } from "../../../di/types";
import { IAuthController } from "../../../controllers/auth/IAuthController";

const authController = resolve<IAuthController>(DI_CONTROLLERS.AUTH_CONTROLLER);

router.post(
  "/signin",
  checkBlockedUser,
  authController.login.bind(authController)
);
router.post(
  "/google",
  authController.googleAuthentication.bind(authController)
);

router.post(
  "/register/company",
  authController.registerCompany.bind(authController)
);
router.post(
  "/register/interviewer",
  uploader.single("resume"),
  authController.registerInterviewer.bind(authController)
);

router.post("/otp/verify", authController.authenticateOTP.bind(authController));
router.post(
  "/verify-account",
  authController.verifyUserAccount.bind(authController)
);
router.put(
  "/interviewer/account/setup",
  uploader.single("resume"),
  authController.setupInterviewerAccount.bind(authController)
);
router.post(
  "/otp/resend",
  authController.triggerOtpResend.bind(authController)
);

router.post(
  "/forgot-password",
  authController.requestPasswordReset.bind(authController)
);
router.post(
  "/reset-password",
  authController.resetUserPassword.bind(authController)
);

router.post(
  "/refresh-token",
  authController.refreshAccessToken.bind(authController)
);

router.post("/signout", authController.signout.bind(authController));

export default router;
