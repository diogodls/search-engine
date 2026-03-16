import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  article: string;

  @Column({nullable: true})
  document_length?: number;
}