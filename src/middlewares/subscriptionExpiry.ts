import { NextFunction, Request, Response } from "express";
import Company, { ICompany } from "../models/company/Company";
import { ISubscriptionRecord } from "../models/subscription/SubscriptionRecord";

import { createResponse, errorResponse } from "../helper/responseHandler";
import { HttpStatus } from "../config/HttpStatusCodes";

type ICompanyWithPopulatedPlan = Omit<ICompany, "activePlan"> & {
  activePlan: ISubscriptionRecord;
};

export async function ensureActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const companyId = req.user?.userId;

    const company = (await Company.findById(companyId).populate(
      "activePlan"
    )) as ICompanyWithPopulatedPlan | null;

    if (!company || !company.activePlan) {
      return createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        "Access denied. Please purchase a subscription to unlock this feature."
      );
    }

    const { activePlan } = company;

    const now = new Date();
    const isExpired =
      !activePlan.endDate ||
      new Date(activePlan.endDate) < now ||
      activePlan.status !== "active";

    if (isExpired) {
      return createResponse(
        res,
        HttpStatus.FORBIDDEN,
        false,
        "Subscription has expired or is inactive."
      );
    }

    next();
  } catch (error) {
    console.error("Subscription check failed:", error);
    return errorResponse(res, error);
  }
}
