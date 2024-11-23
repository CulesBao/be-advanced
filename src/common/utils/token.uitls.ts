import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import ApiError from '../../middleware/CustomError';
import { StatusCodes } from 'http-status-codes';
dotenv.config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const generateToken = (id: number): string => {
    if (accessTokenSecret)
        return jwt.sign({ id }, accessTokenSecret, {
            expiresIn: '1h'
        });
    return ''
};
const verifyToken = (token: string): number => {
    try {
        if (!accessTokenSecret)
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized');

        const decoded = jwt.verify(token, accessTokenSecret) as jwt.JwtPayload;

        if (!decoded || typeof decoded === 'string' || !decoded.id) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not found');
        }

        return decoded.id;
    } catch (err) {
        throw err;
    }
}
export default { generateToken, verifyToken }