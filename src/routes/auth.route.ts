import { Router } from "express";
import { loginController, refreshController } from "../controllers/auth.controller";
const router = Router()
export default router

router.post('/login', loginController)
router.post('/refresh', refreshController)