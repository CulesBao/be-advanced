import { baseRepository } from "../../template/base.repository";
import { Workspace } from "./entity/Workspace";
import CustomError from "../../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { User } from "../user/entity/User";
import cacheService from "../cache/cache.service";
import { TrelloEnum } from "../../types/trello";

export class WorkSpaceRepository extends baseRepository<Workspace> {
    public override async findById(id: number): Promise<Workspace> {
        const workSpaceCache = await cacheService.get(`${TrelloEnum.Workspace} + ${id}`)
        let workSpace : Workspace | null;
        if (workSpaceCache == null){
            workSpace = await this.repository.findOne({
                where: {
                    id
                },
                relations: ['admin', 'users', 'boards'],
                select: ['id', 'name', 'admin', 'users', 'boards']
            })
        }
        else 
            workSpace = (typeof workSpaceCache == 'string') ? JSON.parse(workSpaceCache) : workSpaceCache
        if (!workSpace)
            throw new CustomError(StatusCodes.NOT_FOUND, `Workspace with id ${id} not found`)
        return workSpace
    }
    public async getMyWorkSpace(userId: number): Promise<Workspace[]> {
        const workSpacesCache = await cacheService.get(`${TrelloEnum.Workspace} + "userID" + ${userId}`)
        let workSpaces : Workspace[] | null;
        if (workSpacesCache == null){
            workSpaces = await this.repository.find({
                where: {
                    admin: {
                        id: userId
                    }
                },
                relations: ['admin', 'users', 'boards'],
                select: ['id', 'name', 'admin', 'users', 'boards']
            })
        }
        else 
            workSpaces = (typeof workSpacesCache == 'string') ? JSON.parse(workSpacesCache) : workSpacesCache
        if (workSpaces == null)
            throw new CustomError(StatusCodes.NOT_FOUND, "User does not have any workspace")
        await cacheService.set(`${TrelloEnum.Workspace} + "userID" + ${userId}`, workSpaces)
        return workSpaces
    }
    public async getField(id: number, field: string): Promise<any> {
        const workspace = await this.findByField('id', id)
        if (workspace[field] == null)
            throw new CustomError(StatusCodes.BAD_REQUEST, "Field invalid!")
        return workspace[field]
    }
    public async addMemberToWorkSpace(workspace: Workspace, user: User): Promise<Workspace> {
        workspace.users.push(user)
        await cacheService.set(`${TrelloEnum.Workspace} + ${workspace.id}`, workspace)
        await this.repository.save(workspace)
        return workspace
    }
    public async deleteMemberOutOfWorkspace(workspaceId: number, userId: number) {
        const workSpace = await this.findById(workspaceId)
        workSpace.users = workSpace.users.filter((value: User) => value.id !== userId)
        await this.repository.save(workSpace)
        this.repository.save(workSpace)
    }
    public override async create(entity: Workspace): Promise<Workspace> {
        const workspace = await this.repository.save(entity)
        await cacheService.set(`${TrelloEnum.Workspace} + ${workspace.id}`, workspace)
        return workspace
    }
    public override async delete(id: number): Promise<void> {
        await this.findById(id)
        await this.repository.delete(id)
        await cacheService.del(`${TrelloEnum.Workspace} + ${id}`)
    }
    public override async update(id: number, entity: Workspace): Promise<Workspace> {
        await this.findById(id)
        await this.repository.save(entity)
        await cacheService.set(`${TrelloEnum.Workspace} + ${id}`, entity)
        return entity
    }
}