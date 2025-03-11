import { Router } from "express";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { CompanyService } from "../../../services/company/CompanySerive";
import { CompanyController } from "../../../controllers/company/CompanyController";
import { verifyToken } from "../../../middlewares/Auth";
const router=Router()

const companyRepository=new CompanyRepository()
const companyService=new CompanyService(companyRepository)
const companyController=new CompanyController(companyService) 


//company profile
router.get("/profile",verifyToken,companyController.getCompanyById.bind(companyController))
router.put("/profile",verifyToken,companyController.updateCompanyProfile.bind(companyController))



export default router