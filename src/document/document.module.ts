import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { DocumentController } from "./document.controller";
import { DocumentService } from "./document.service";
import { Document } from "../models/document.entity";
import {IndexService} from "../index/index.service";
import {SearchService} from "../search/search.service";
import {Term} from "../models/term.entity";
import {TermDocument} from "../models/terms_document.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        database: configService.getOrThrow('DATABASE_NAME'),
        autoLoadEntities: true,
        entities: [Document],
        synchronize: false,
      })
    },
    ),
    TypeOrmModule.forFeature([Document, Term, TermDocument])
  ],
  controllers: [DocumentController],
  providers: [DocumentService, IndexService, SearchService],
})
export class DocumentModule {}
