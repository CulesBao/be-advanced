import { CustomSuccessfulResponse } from '../../template/response.dto'
import hashUtils from '../../utils/hash.utils'
import tokenUtils from '../../utils/token.uitls'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../../utils/CustomError'
import { User } from '../user/entity/User'
import { UserService } from '../user/user.repository'
import client from '../../config/redis.config'

class authService {
    private userService = new UserService(User)
    async register(userData: User): Promise<CustomSuccessfulResponse> {
        try {
            const findByUsername = await this.userService.findForRegister('username', userData.username)
            const findByEmail = await this.userService.findForRegister('email', userData.email)
            if (findByUsername || findByEmail)
                throw new CustomError(StatusCodes.BAD_REQUEST, "Username or email existed")
            userData.password = await hashUtils.hashPassword(userData.password)
            await this.userService.create(userData)
            return new CustomSuccessfulResponse(StatusCodes.CREATED, "Register successful")
        } catch (err) {
            throw err
        }
    }
    async login(loginData: User): Promise<CustomSuccessfulResponse> {
        try {
            if (!loginData.username)
                throw new CustomError(StatusCodes.NOT_FOUND, "Cannot found username")
            const user = await this.userService.findByUsername(loginData.username)
            if (!await hashUtils.comparePassword(loginData.password, user.password))
                throw new CustomError(StatusCodes.NOT_FOUND, "Wrong username or password")
            client.set('logger', JSON.stringify(user))
            const token = tokenUtils.generateToken(user.id)
            return new CustomSuccessfulResponse(StatusCodes.OK, "Login successful", { token })
        } catch (err) {
            throw err
        }
    }

}
export default new authService()