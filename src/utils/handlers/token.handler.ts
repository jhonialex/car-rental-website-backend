import jwt from 'jsonwebtoken'

const jwtSecret: string = `${process.env.JWT_SECRET}`
const jwtRefresh: string = `${process.env.JWT_REFRESH_SECRET}`

interface validateTokenReturn {
    valid: boolean,
    decoded: null | string | jwt.JwtPayload
}

export function generateToken(refresh: boolean, hash: string) {

    return jwt.sign({ hash }, (refresh ? jwtRefresh : jwtSecret), {
        algorithm: 'HS256',
        expiresIn: (refresh ? '1d' : '6h')
    })

}

export async function validateToken(token: string, refresh: boolean): Promise<validateTokenReturn> {

    try {

        const decoded = jwt.verify(token, (refresh ? jwtRefresh : jwtSecret))
        return {
            valid: true,
            decoded
        }

    } catch (err) {
        return {
            valid: false,
            decoded: null
        }
    }

}