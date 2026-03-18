import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TermDocument} from "./terms_document.entity";

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

  @OneToMany(() => TermDocument, td => td.document)
  termDocuments: TermDocument[];
}