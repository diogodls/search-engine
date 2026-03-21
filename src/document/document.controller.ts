import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors} from "@nestjs/common";
import {DocumentDto} from "./dto/document.dto";
import {DocumentService} from "./document.service";
import {IndexService} from "../index/index.service";
import {CacheInterceptor} from "@nestjs/cache-manager";
import {ExceptionHandler} from "@nestjs/core/errors/exception-handler";

@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly indexService: IndexService,
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
  async searchDocuments(@Query('search') search: string) {
    const normalizedSearch = this.indexService.cleanText(search);
    const filteredSearch = this.indexService.filterStopWords(normalizedSearch);
    const results = await this.documentService.getDocumentsTF(filteredSearch);

    const documentIds = results.map((item) => item.documentId);

    return this.documentService.getSearchDocuments(documentIds);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.documentService.getDocument(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDocument: DocumentDto) {
    await this.documentService.updateDocument(id, updateDocument);

    await this.indexService.updateIndexes(updateDocument);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.documentService.deleteDocument(id);

    await this.indexService.deleteTermDocument(id);
  }
}