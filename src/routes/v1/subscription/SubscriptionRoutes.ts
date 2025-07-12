import { Router } from "express";
import { Roles } from "../../../constants/roles";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
import { resolve } from "../../../di";
import { ISubscriptionController } from "../../../controllers/subscription/ISubscriptonController";
import { DiControllers } from "../../../di/types";
const router = Router();

const subscriptionPlanController = resolve<ISubscriptionController>(
DiControllers.SubscriptionController
);

router.post(
  "/",
  verifyToken,
  checkRole([Roles.ADMIN]),
  subscriptionPlanController.createSubscription.bind(subscriptionPlanController)
);

router.get(
  "/",
  verifyToken,
  checkRole([Roles.ADMIN, Roles.COMPANY]),
  subscriptionPlanController.getAllSubscriptions.bind(
    subscriptionPlanController
  )
);

router.put(
  "/:subscriptionId",
  verifyToken,
  checkRole([Roles.ADMIN]),
  subscriptionPlanController.updateSubscription.bind(subscriptionPlanController)
);

export default router;
