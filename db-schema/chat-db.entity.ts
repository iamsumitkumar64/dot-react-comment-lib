import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("chat")
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "uuid", nullable: true })
    message_parent_uuid: string;

    @Column({ type: "text" })
    message: string;

    @ManyToOne(() => UserEntity, (user) => user.uuid)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}