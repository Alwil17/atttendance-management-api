import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Emargement } from "./emargement.model";
import {User} from "./user.model";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    timestamp: Date;

    @Column()
    message: string;

    @Column()
    status: string; // "Envoyée", "Confirmée", etc.

    @ManyToOne(() => Emargement)
    emargement: Emargement;

    @ManyToOne(() => User)
    recipient: User;
}
