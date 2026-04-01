import {Test} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Term} from "../../models/term.entity";
import {TermDocument} from "../../models/terms_document.entity";
import {IndexService} from "../index.service";
import {DocumentDto} from "../../document/dto/document.dto";

describe('IndexService', () => {
  let indexService: IndexService;

  const termRepositoryMock = {};
  const termDocumentRepositoryMock = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IndexService,
        {
          provide: getRepositoryToken(Term),
          useValue: termRepositoryMock,
        },
        {
          provide: getRepositoryToken(TermDocument),
          useValue: termDocumentRepositoryMock,
        },
      ],
    })
      .compile();

    indexService = module.get(IndexService);
  });

  it('should clean and remove the stop words of a document', () => {
    const newDocument: DocumentDto = {
      title: 'test article',
      article: 'artigo teste de comparação para saber o tamãnhô do documentô límpo com acentos nas palávras e cràses nelas',
    };

    expect(indexService.tokenizeDocument(newDocument)) //todo: finish
  });

  it('should create inverted indexes', () => {

  });

  it('should get documents ordered by TF', () => {

  });

  it('should get documents ordered by IDF', () => {

  });
})