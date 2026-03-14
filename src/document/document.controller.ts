import {Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors} from "@nestjs/common";
import {DocumentDto} from "./dto/document.dto";
import {DocumentService} from "./document.service";
import {IndexService} from "../index/index.service";
import {CacheInterceptor} from "@nestjs/cache-manager";

@Controller('/document')
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
  create(@Body() document: DocumentDto) {
    return this.documentService.createDocument(document);
  }

  @Get('/a')
  async getFirstIndex() {
    const documents = await this.documentService.getDocuments();

    for(let i = 0; i < documents.length; i++) {
      const tokenizedDocument = this.indexService.tokenizeDocument(documents[i]);

      this.indexService.getInvertedIndexes(documents[i], tokenizedDocument);
    }
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