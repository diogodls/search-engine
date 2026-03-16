import {Injectable} from "@nestjs/common";
import {IndexService} from "../index/index.service";

@Injectable()
export class SearchService {
  constructor(
    private readonly indexService: IndexService,
  ) {}

  getDocumentsIdsBySearch(search: string[]): number[] {
    const index = this.indexService.getIndex();

    const searchMap = new Map<number, number>();

    search.forEach((token) => {
      const document = index.get(token);

      if (!document) return;

      for (const [id, frq] of document) {
        const acc = searchMap.get(id) || 0;
        searchMap.set(id, frq + acc);
      }
    });

    const sortedDocuments =
      [...searchMap!.entries()].sort(([_, a], [_id, b]) => b - a);

    return sortedDocuments.map(([id]) => id);
  }
}