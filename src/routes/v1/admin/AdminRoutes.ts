import { Router } from "express";
const router=Router()
import {AdminController} from "../../../controllers/admin/AdminController"
import{AdminService} from "../../../services/admin/AdminService"
import{AdminRepository} from "../../../repositories/admin/AdminRepository"

const adminRepository=new AdminRepository()
const adminService=new AdminService(adminRepository)
const adminController=new AdminController(adminService)



router.post('/signin',adminController.login.bind(adminController))



export default router