import {DocumentService} from "./document.service";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Test} from "@nestjs/testing";

const mockCacheManager = {
  get: jest.fn(),
}

describe("DocumentService", () => {
  let documentService: DocumentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        DocumentService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ]
    }).compile();

    documentService = moduleRef.get<DocumentService>(DocumentService);
  });

  it("should be defined", () => {
    expect(documentService).toBeDefined();
  })
})