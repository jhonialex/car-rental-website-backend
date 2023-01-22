import { Request, Response } from 'express'
import { generateToken, validateToken } from '../utils/handlers/token.handler'
import { LoginValidation, RefreshValidation } from '../utils/validations/auth.validations'
import jwt from 'jsonwebtoken'

async function loginController(req: Request, res: Response) {
    try {

        // since it is a simple website, we only have one admin account
        // so we do not deal with authentication at all

        const { error, value } = LoginValidation.validate(req.body)

        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        const data: { username: string, password: string } = value
        const { adminUsername, adminPassword } = process.env

        if (data.username.toLowerCase() !== adminUsername!.toLowerCase() || data.password !== adminPassword) return res.status(401).send({ message: 'Incorrect login details' })

        const hash = adminPassword.substring(0, 6)

        const token = generateToken(false, hash)
        const refreshToken = generateToken(true, hash)

        return res.status(200).send({ token, refreshToken })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to sign in' })
    }
}

async function refreshController(req: Request, res: Response) {
    try {

        const { error, value } = RefreshValidation.validate(req.body)
        if (error) return res.status(400).send({ message: 'Invalid fields values' })

        const data: { refreshToken: string } = value

        const { decoded, valid }: { decoded: null | string | jwt.JwtPayload, valid: boolean } = await validateToken(data.refreshToken, true)

        if (!valid || !decoded) return res.status(500).send({ message: 'Not possible to refresh token' })

        const { hash }: any = decoded

        if (!hash) {
            return res.status(500).send({ message: 'Failed to validate token' })
        }

        const adminHash: string = process.env.adminPassword!.substring(0, 6)
        if (hash !== adminHash) return res.status(500).send({ message: 'Invalid token' })

        const token = generateToken(false, adminHash)
        const refreshToken = generateToken(true, adminHash)

        return res.status(200).send({ token, refreshToken })

    } catch (err) {
        return res.status(500).send({ message: 'Not possible to refresh token' })
    }
}

export { loginController, refreshController }