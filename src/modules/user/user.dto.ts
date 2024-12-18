import { User } from "./User.entity"

export class UserDTOForWorkspace {
    id: number
    email: string
    constructor(user: User) {
        this.id = user.id
        this.email = user.email
    }
}
export interface AssignRoleDTO {
    userId: number,
    roleId: number
}
export class UserDTO{
    id: number
    email: string
    name: string
    createAt: Date
    updateAt: Date
    constructor(user: User) {
        this.id = user.id
        this.email = user.email
        this.name = user.name
        this.createAt = user.createAt
        this.updateAt = user.updateAt
    }
}
export class UpdateUserDTO {
    name: string
    phoneNumber: string
    birthDate: Date
    constructor(name: string, phoneNumber: string, birthDate: Date) {
        this.name = name
        this.phoneNumber = phoneNumber
        this.birthDate = birthDate
    }
}