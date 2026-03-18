import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Document} from "../models/document.entity";
import {DocumentDto} from "./dto/document.dto";

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  cleanText(text: string) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '');
  }

  getDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  getSearchDocuments(ids: number[]) {
    return this.documentRepository
      .createQueryBuilder('d')
      .where('d.id IN (:...ids)', { ids })
      .orderBy('array_position(:ids, d.id)')
      .setParameter('ids', ids)
      .getMany();
  }

  getDocument(id: number): Promise<Document | null> {
    return this.documentRepository.findOneBy({id});
  }

  createDocument(document: DocumentDto): Promise<Document> {
    const documentLength = this.cleanText(document.article).split(' ').length;

    return this.documentRepository.save({...document, document_length: documentLength});
  }

  deleteDocument(id: number): Promise<DeleteResult> {
    return this.documentRepository.delete(id);
  }

  updateDocument(id: number, document: DocumentDto): Promise<UpdateResult> {
    return this.documentRepository.update(id, document);
  }
}