import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";
import {DocumentDto} from "./dto/document.dto";
import {DocumentService} from "./document.service";
import {IndexService} from "../index/index.service";
import {CacheInterceptor} from "@nestjs/cache-manager";
import {SearchService} from "../search/search.service";
import {Document} from "../models/document.entity";
import {ExceptionHandler} from "@nestjs/core/errors/exception-handler";

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

    if (!newDocument.id) return new ExceptionHandler().handle(new Error('Failed to create document'));

    await this.indexService.createIndexes(newDocument);
  }

  @Get('/search')
  async searchDocuments(@Query('search') search: string): Promise<Document[]> {
    const documents = await this.documentService.getDocuments();

    for (const document of documents) {
      const tokenizedDocument = this.indexService.tokenizeDocument(document);

      this.indexService.getInvertedIndexes(document, tokenizedDocument);
    }

    const normalizedSearch = this.indexService.cleanText(search);
    const filteredSearch = this.indexService.filterStopWords(normalizedSearch);
    const documentsIds = this.searchService.getDocumentsIdsBySearch(filteredSearch);

    return this.documentService.getSearchDocuments(documentsIds);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.documentService.getDocument(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateDocumentDto: DocumentDto) {
    return this.documentService.updateDocument(id, updateDocumentDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}