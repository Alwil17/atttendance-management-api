import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom: string;

    @Column("int")
    volumeHoraire: number;
}
