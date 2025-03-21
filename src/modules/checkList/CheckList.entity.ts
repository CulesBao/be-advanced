import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { baseEntity } from "../../common/base.entity";
import { Card } from "../card/Card.entity";

@Entity()
export class CheckList extends baseEntity {
    @Column({ type: "boolean", nullable: false, default: false })
    isDone!: boolean

    @Column({ type: "varchar", length: 200, nullable: false })
    content!: string

    @ManyToOne(() => Card, card => card.checkLists, {onDelete: "CASCADE"})
    @JoinColumn({name: "cardId"})
    card!: Card
}