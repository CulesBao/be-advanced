import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { baseEntity } from "../../common/base.entity";
import { Board } from "../board/Board.entity";
import { Card } from "../card/Card.entity";

@Entity()
export class List extends baseEntity {
    @Column({ type: "varchar", length: 100, nullable: false })
    name!: string

    @Column({ type: "int", nullable: false })
    order!: number

    @OneToMany(() => Card, card => card.list)
    cards!: Card[]

    @ManyToOne(() => Board, board => board.lists, { onDelete: "CASCADE" })
    @JoinColumn({ name: "boardId" })
    board!: Board
}