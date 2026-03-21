import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Document} from "../models/document.entity";
import {DocumentDto} from "./dto/document.dto";
import {TermDocument} from "../models/terms_document.entity";

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(TermDocument)
    private termDocumentRepository: Repository<TermDocument>,
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

  async getDocumentsTF(search: string[]) {
    return await this.termDocumentRepository
      .createQueryBuilder('td')
      .select('td."documentId"', 'documentId')
      .addSelect('COUNT(*)', 'tf')
      .innerJoin('term', 't', 't.id = td."termId"')
      .where('t.term IN (:...search)', { search })
      .having('COUNT(DISTINCT t.term) = :size', { size: search.length })
      .groupBy('td."documentId"')
      .orderBy('tf', 'DESC')
      .getRawMany();
  }

  async getSearchDocuments(ids: number[]) {
    return await this.documentRepository
      .createQueryBuilder('d')
      .where('d.id IN (:...ids)', {ids})
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