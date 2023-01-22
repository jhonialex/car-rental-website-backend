// contact route
// schedule reservation: date & time, car, (deliver or pick it up),
//                       full name, email & phone number
// sends email to "whatever@gmail.com" including this "reservation"

import { Router } from "express";
const router = Router()
export default router

router.get('/potato', async (req, res) => {
    return res.status(200).send({ message: 'ok' })
})