import { Router } from "express";
import { CompanyRepository } from "../../../repositories/company/CompanyRepository";
import { CompanyService } from "../../../services/company/CompanySerive";
import { CompanyController } from "../../../controllers/company/CompanyController";
const router=Router()

const companyRepository=new CompanyRepository()
const companyService=new CompanyService(companyRepository)
const companyController=new CompanyController(companyService)

router.post('/register',companyController.register.bind(companyController))
router.post('/login',companyController.login.bind(companyController))



export default router