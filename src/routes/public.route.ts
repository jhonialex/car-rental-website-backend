import { Router } from "express";
import { getDataController } from "../controllers/public.controller";
const router = Router()
export default router

router.get('/data', getDataController)