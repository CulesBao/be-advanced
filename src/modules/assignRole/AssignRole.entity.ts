import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { baseEntity } from "../../common/base.entity";
import { User } from "../user/User.entity";
import { Role } from "../roles/Role.entity";
import { Workspace } from "../workspace/Workspace.entity";
import { Board } from "../board/Board.entity";

@Entity()
export class AssignRole extends baseEntity{
    @ManyToOne(() => User, user => user.assignRoles)
    @JoinColumn({name: 'user_id'})
    user!: User;

    @ManyToOne(() => Role, role => role.assignRoles)
    @JoinColumn({name: 'role_id'})
    role!: Role;

    @ManyToOne(() => Workspace, workspace => workspace.assignRoles)
    @JoinColumn({name: 'workspace_id'})
    workspace: Workspace | null = null;

    @ManyToOne(() => Board, board => board.assignRoles)
    @JoinColumn({name: 'board_id'})
    board: Board | null = null;
}