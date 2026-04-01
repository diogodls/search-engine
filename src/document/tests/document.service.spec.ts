import {DocumentService} from "../document.service";
import {Test, TestingModule} from "@nestjs/testing";
import {Document} from "../../models/document.entity";
import {TermDocument} from "../../models/terms_document.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {DocumentDto} from "../dto/document.dto";
import {IndexService} from "../../index/index.service";
import {Term} from "../../models/term.entity";
import {expect} from "@jest/globals";

describe("DocumentService", () => {
  let documentService: DocumentService;

  const documentRepositoryMock = {
    find: jest.fn().mockResolvedValue([]),
    save: jest.fn().mockImplementation((document: DocumentDto) => Promise.resolve({
      id: 1,
      document_length: document.article.split(' ').length,
      ...document,
    }))
  };
  const termRepositoryMock = {};
  const termDocumentRepositoryMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        IndexService,
        {
          provide: getRepositoryToken(Term),
          useValue: termRepositoryMock,
        },
        {
          provide: getRepositoryToken(Document),
          useValue: documentRepositoryMock,
        },
        {
          provide: getRepositoryToken(TermDocument),
          useValue: termDocumentRepositoryMock,
        },
      ],
    }).compile();

    documentService = module.get(DocumentService);
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  it("should get all documents", async () => {
    expect(await documentService.getDocuments()).toEqual([]); //todo: fix it
  });

  it("should create a document and return it", async () => {
    const newDocumentDto = {article: 'Test article for unit test of the document controller', title: 'Test article'};

    expect(await documentService.createDocument(newDocumentDto)).toEqual(expect.objectContaining({
      id: expect.any(Number),
      document_length: expect.any(Number),
      ...newDocumentDto
    }));
  });

  // it('should get documents ordered by array position', async () => {
  //   const documentIds = [6,3,4,5];
  //
  //   expect(await documentService.getSearchDocuments(documentIds)).toBe([]); //todo: this stays in the e2e file
  // });

  it('should get the cleaned document length', () => {
    const newDocument: DocumentDto = {
      title: 'test article',
      article: 'artigo teste de comparação para saber o tamãnhô do documentô límpo com acentos nas palávras e cràses nelas',
    };

    expect(documentService.getDocumentLength(newDocument.article)).toEqual(expect.any(Number));
  });
});