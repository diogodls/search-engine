import {DocumentController} from "../document.controller";
import {Test, TestingModule} from "@nestjs/testing";
import {DocumentService} from "../document.service";
import {CacheInterceptor} from "@nestjs/cache-manager";
import {IndexService} from "../../index/index.service";
import {SearchService} from "../../search/search.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Document} from "../../models/document.entity";
import {TermDocument} from "../../models/terms_document.entity";
import {expect} from "@jest/globals";

describe('DocumentController', () => {
  let documentController: DocumentController;

  const documentServiceMock = {
    createDocument: jest.fn((dto) => {
      return {id: 1, ...dto}
    })
  };
  const indexServiceMock = {
    createIndexes: jest.fn((dto) => {
    })
  };
  const documentRepositoryMock = {};
  const termDocumentRepositoryMock = {};
  const cacheMock = {};

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        IndexService,
        SearchService,
        {
          provide: getRepositoryToken(Document),
          useValue: documentRepositoryMock
        },
        {
          provide: getRepositoryToken(TermDocument),
          useValue: termDocumentRepositoryMock
        },
      ]
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue(cacheMock)
      .overrideProvider(DocumentService)
      .useValue(documentServiceMock)
      .overrideProvider(IndexService)
      .useValue(indexServiceMock)
      .compile();

    documentController = testModule.get(DocumentController);
  });

  it('should be defined', () => {
    expect(documentController).toBeDefined();
  });

  it('should create a user', async () => {
    const newDocumentDto = {article: 'Test article for unit test of the document controller', title: 'Test article'};
    expect(await documentController.create(newDocumentDto)).toEqual({...newDocumentDto, id: expect.any(Number)});
    expect(documentServiceMock.createDocument).toHaveBeenCalled();
  });
});