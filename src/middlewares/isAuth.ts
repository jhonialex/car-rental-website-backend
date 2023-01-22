import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/handlers/token.handler";

export async function isAuth(req: Request, res: Response, next: NextFunction) {

    const { token } = req.headers
    if (!token) return res.status(401).send({ message: 'Token not provided' })

    const data = String(token)
    const realToken = data.replace(/^Bearer\s/, "");

    const { decoded, valid } = await validateToken(realToken, false)

    if (!valid || !decoded) return res.status(500).send({ message: 'Invalid token' })

    const { hash }: any = decoded

    if (!hash) {
        return res.status(500).send({ message: 'Failed to validate token' })
    }

    const adminHash: string = process.env.adminPassword!.substring(0, 6)
    if (hash !== adminHash) return res.status(401).send({ message: 'Not allowed' })

    return next()
}