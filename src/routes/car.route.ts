import { Router } from "express";
import multer from "multer";
import { createCarController, deleteCarController, getCarsController, getSingleCarController, updateCarController } from "../controllers/car.controller";
import { isAuth } from "../middlewares/isAuth";
const router = Router()
export default router

router.post('/create', isAuth, multer().fields([{ name: 'image', maxCount: 1}, { name: 'images', maxCount: 20 }]), createCarController)
router.post('/update', isAuth, multer().fields([{ name: 'image', maxCount: 1}, { name: 'images', maxCount: 20 }]), updateCarController)
router.post('/delete', isAuth, deleteCarController)
router.post('/delete', isAuth, deleteCarController)
router.post('/cars', getCarsController)
router.get('/car/:slug', getSingleCarController)