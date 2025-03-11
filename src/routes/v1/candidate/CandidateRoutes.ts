import { Router } from "express";
import { CandidateService } from "../../../services/candidate/CandidateService";
import { CandidateRepository } from "../../../repositories/candidate/CandidateRepository";
import { CandidateController } from "../../../controllers/candidate/CandidateController";

const router=Router()

const candidateRepository=new CandidateRepository();
const candidateService=new CandidateService(candidateRepository)
const candidateController=new CandidateController(candidateService)






export default router