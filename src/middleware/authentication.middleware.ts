import { StatusCodes } from 'http-status-codes';
import tokenUtils from '../utils/token.uitls';
import rolesService from '../service/roles.service';
import { NextFunction } from 'express';
import CustomError from '../utils/CustomError';

class authentication {
    authenticateToken(req: any, _: any, next: any) {
        try {
            const authHeader: string = req.headers['authorization']
            const token: string = authHeader && authHeader.split(' ')[1]
            if (token == null)
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
            const id: number = tokenUtils.verifyToken(token)
            if (!id)
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
            req.id = id
            next()
        }
        catch (err) {
            next(err)
        }
    }
    authorizeRole = (requiredRole: string) => {
        return async (req: any, _: any, next: any) => {
            try {
                const id: number = req.id;
                if (!id) {
                    throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
                }
                const rolesName: string[] = await rolesService.userRoles(id);
                if (!rolesName.includes(requiredRole)) {
                    throw new CustomError(StatusCodes.FORBIDDEN, 'Forbidden');
                }
                next();
            } catch (err) {
                next(err);
            }
        };
    }
    authorizePermission = (requiredPermission: string) => {
        return async (req: any, _: any, next: any) => {
            try {
                const id: number = req.id;
                if (!id) {
                    throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
                }
                const permissions: string[] = await rolesService.userPermissions(id);

                if (!permissions.includes(requiredPermission)) {
                    throw new CustomError(StatusCodes.FORBIDDEN, 'Cannot access this resource');
                }
                next();
            } catch (err) {
                next(err);
            }
        };
    }
}
export default new authentication()