import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {DocumentDto} from "./dto/document.dto";
import {DocumentService} from "./document.service";
import {IndexService} from "../index/index.service";

@Controller('/document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly indexService: IndexService,
  ) {}

  @Get()
  findAll() {
    return this.documentService.getDocuments();
  }

  @Post()
  create(@Body() document: DocumentDto) {
    return this.documentService.createDocument(document);
  }

  @Get('/a')
  async getFirstIndex() {
    const document = await this.documentService.getDocuments();

    const tokenizedDocument = this.indexService.tokenizeDocument(document[0]);
    const getInvertedIndexes = this.indexService.getInvertedIndexes(document[0], tokenizedDocument);
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