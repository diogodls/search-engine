import {SearchService} from "../search.service";
import {Test} from "@nestjs/testing";
import {Document} from "../../models/document.entity";
import {TermDocument} from "../../models/terms_document.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('SearchService', () => {
  let searchService: SearchService;

  const documentRepositoryMock = {};
  const termDocumentRepositoryMock = {};

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
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
      .compile();

    searchService = module.get(SearchService);
  });

  it('should get TF of a term in a document', () => {

  });

  it('should get IDF of a term', () => {

  });

});