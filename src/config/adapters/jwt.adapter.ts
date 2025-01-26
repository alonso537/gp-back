import jwt from 'jsonwebtoken';


export const jwtAdapter = {
    sign: (payload: any, secret: string, expiresIn: string) => jwt.sign(payload, secret, {expiresIn}),
    verify: (token: string, secret: string) => jwt.verify(token, secret)
}