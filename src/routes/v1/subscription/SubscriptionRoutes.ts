
import { Router } from "express";
import { SubscriptionPlanRepository } from "../../../repositories/subscription/subscription-plan/SubscriptionPlanRepository";
import { SubscriptionPlanService } from "../../../services/subscription/subscription-plan/SubscriptionPlanService";
import { SubscriptionController } from "../../../controllers/subscription/SubscriptionController";
import { Roles } from "../../../constants/roles";
import { checkRole, verifyToken } from "../../../middlewares/Auth";
const router = Router();
const subscriptionPlanRepository = new SubscriptionPlanRepository();
const subscriptionPlanService = new SubscriptionPlanService(
  subscriptionPlanRepository
);
const subscriptionPlanController = new SubscriptionController(
  subscriptionPlanService
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
    checkRole([Roles.ADMIN,Roles.COMPANY]),
    subscriptionPlanController.getAllSubscriptions.bind(subscriptionPlanController)
  );
  
  router.put(
    "/:subscriptionId",
    verifyToken,
    checkRole([Roles.ADMIN]),
    subscriptionPlanController.updateSubscription.bind(subscriptionPlanController)
  );

  export default router