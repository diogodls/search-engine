import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Document} from "../models/document.entity";
import {DocumentDto} from "./dto/document.dto";
import {IndexService} from "../index/index.service";

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private readonly indexService: IndexService,
  ) {}

  getDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  getDocument(id: number): Promise<Document | null> {
    return this.documentRepository.findOneBy({id});
  }

  createDocument(document: DocumentDto): Promise<Document> {
    const documentLength = this.getDocumentLength(document.article);

    return this.documentRepository.save({...document, document_length: documentLength});
  }

  deleteDocument(id: number): Promise<DeleteResult> {
    return this.documentRepository.delete(id);
  }

  updateDocument(id: number, document: DocumentDto): Promise<UpdateResult> {
    const documentLength = this.getDocumentLength(document.article);

    return this.documentRepository.update(id, {...document, document_length: documentLength});
  }

  getDocumentLength(article: string) {
    return this.indexService.cleanText(article).split(' ').length
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