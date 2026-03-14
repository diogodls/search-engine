import {Injectable} from "@nestjs/common";
import {IndexService} from "../index/index.service";
import {DocumentService} from "../document/document.service";

@Injectable()
export class SearchService {
  constructor(
    private readonly indexService: IndexService,
    private readonly documentService: DocumentService,
  ) {}

  getDocumentsBySearch(search: string): string {
    const normalizedSearch = this.indexService.cleanText(search);
    const index = this.indexService.getIndex();

    if (index.has(normalizedSearch)) console.log('tem', index);

    return `Search for: ${search}`;
  }
}