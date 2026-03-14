import {Controller, Get, Query} from "@nestjs/common";
import {SearchService} from "./search.service";

@Controller('')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Get()
  searchDocuments(@Query('search') search: string): string {
    return this.searchService.getDocumentsBySearch(search);
  }
}