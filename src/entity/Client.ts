import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import { SystemUser } from "./SystemUser";

@Entity()
export class Client {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean;

    // @JoinColumn()
    // @OneToOne(type => SystemUser)
    // createdBy :SystemUser;

    @JoinColumn()
    @OneToOne(type => SystemUser, nullable => false)
    lastUpdatedBy :SystemUser;

    @Column()
    creationDate : Date;

    @Column()
    lastUpdatedDate : Date;

}
