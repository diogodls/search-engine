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

  async getDocumentsTF(search: string[]) {
    const termFrequency = await this.termDocumentRepository
      .createQueryBuilder('td')
      .select('COUNT(*)')
      .addSelect('t.term', 'term')
      .addSelect('d.id', 'documentId')
      .addSelect('d.document_length', 'documentLength')
      .innerJoin('term', 't', 't.id = td."termId"')
      .innerJoin('document', 'd', 'd.id = td."documentId"')
      .where('t.term IN (:...search)', {search})
      .groupBy('t.term')
      .addGroupBy('d.id')
      .addGroupBy('d.document_length')
      .getRawMany();

    return termFrequency.map((item) => {
      return {
        term: item.term,
        tf: Number(item.count)/item.documentLength,
        documentId: item.documentId,
      }
    });
  }

  async getDocumentsIDF(search: string[]) {
    const documentCount = await this.documentRepository.createQueryBuilder().getCount();

    const terms = await this.termDocumentRepository
      .createQueryBuilder('td')
      .select('t.term', 'term')
      .addSelect('COUNT(DISTINCT td."documentId")', 'count')
      .innerJoin('term', 't', 't.id = td."termId"')
      .where(`t.term IN (:...terms)`, {terms: search})
      .groupBy('t.term')
      .getRawMany();

    const termsIDFMap = new Map<string, number>();

    terms.forEach((item) => termsIDFMap.set(item.term, Math.log(documentCount/item.count)));

    return termsIDFMap;
  }

  async getSearchDocuments(ids: number[]) {
    return await this.documentRepository
      .createQueryBuilder('d')
      .where('d.id IN (:...ids)', {ids})
      .orderBy('array_position(:ids, d.id)')
      .setParameter('ids', ids)
      .getMany();
  }
}