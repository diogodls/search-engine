import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { Document } from "../models/document.entity";
import {IndexService} from "../index/index.service";
import {SearchService} from "../search/search.service";
import {Term} from "../models/term.entity";
import {TermDocument} from "../models/terms_document.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Term, TermDocument]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService, IndexService, SearchService],
})
export class DocumentModule {}
