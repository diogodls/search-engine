import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors
} from "@nestjs/common";
import {DocumentDto} from "./dto/document.dto";
import {DocumentService} from "./document.service";
import {IndexService} from "../index/index.service";
import {CacheInterceptor} from "@nestjs/cache-manager";
import {SearchService} from "../search/search.service";

@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly indexService: IndexService,
    private readonly searchService: SearchService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  findAll() {
    return this.documentService.getDocuments();
  }

  @Post()
  async create(@Body() document: DocumentDto) {
    const newDocument =  await this.documentService.createDocument(document);

    if (!newDocument.id) throw new BadRequestException();

    await this.indexService.createIndexes(newDocument);

    return newDocument;
  }

  @Get('/search')
  async searchDocuments(@Query('search') search: string) {
    const normalizedSearch = this.indexService.cleanText(search);
    const filteredSearch = this.indexService.filterStopWords(normalizedSearch);

    const documentsTF = await this.searchService.getDocumentsTF(filteredSearch);
    const documentsIDF = await this.searchService.getDocumentsIDF(filteredSearch);

    const documentsMap = new Map<number, number>();

    documentsTF.forEach((item) => {
      const itemTF_IDF = item.tf * (documentsIDF.get(item.term) ?? 0);
      const acc = documentsMap.get(item.documentId) ?? 0;

      documentsMap.set(item.documentId, itemTF_IDF + acc);
    });

    const documentIds = [...documentsMap.entries()].sort(([_, a], [_id, b]) => b - a).map(item => item[0]);
    return this.documentService.getSearchDocuments(documentIds);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.getDocument(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDocument: DocumentDto) {
    const updatedDocument = await this.documentService.updateDocument(id, updateDocument);

    await this.indexService.updateIndexes({...updateDocument, id: id});

    return updatedDocument;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deletedDocument = await this.documentService.deleteDocument(id);

    await this.indexService.deleteTermDocument(id);
    //todo: make a pattern for the response of endpoints
    return deletedDocument;
  }
}