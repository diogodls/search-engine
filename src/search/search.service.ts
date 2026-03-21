import {Injectable} from "@nestjs/common";
import {IndexService} from "../index/index.service";

@Injectable()
export class SearchService {
  constructor(
    private readonly indexService: IndexService,
  ) {}

}