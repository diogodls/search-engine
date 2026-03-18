import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TermDocument} from "./terms_document.entity";

@Entity()
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  term: string;

  @OneToMany(() => TermDocument, td => td.term)
  termDocuments: TermDocument[];
}