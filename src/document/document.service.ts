import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Document} from "./entity/document.entity";
import {DocumentDto} from "./dto/document.dto";

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  getDocuments(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  getDocument(id: number): Promise<Document | null> {
    return this.documentRepository.findOneBy({id});
  }

  createDocument(document: DocumentDto): Promise<Document> {
    console.log(document);
    return this.documentRepository.save(document);
  }

  deleteDocument(id: number): Promise<DeleteResult> {
    return this.documentRepository.delete(id);
  }

  updateDocument(id: number, document: DocumentDto): Promise<UpdateResult> {
    return this.documentRepository.update(id, document);
  }
}