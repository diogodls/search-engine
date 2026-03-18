import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Term} from "./term.entity";
import {Document} from "./document.entity";

@Entity()
export class TermDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, document => document.termDocuments)
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column()
  documentId: number;

  @ManyToOne(() => Term, term => term.termDocuments)
  @JoinColumn({ name: 'termId' })
  term: Term;

  @Column()
  termId: number;

  @Column()
  position: number;
}