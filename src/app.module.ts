import { Module } from '@nestjs/common';
import {DocumentModule} from "./document/document.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CacheInterceptor, CacheModule} from "@nestjs/cache-manager";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {TermDocument} from "./models/terms_document.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Term} from "./models/term.entity";
import {Document} from "./models/document.entity";

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
    TypeOrmModule.forFeature([Document, Term, TermDocument]),
    CacheModule.register({
      ttl: 0,
      max: 1000,
      isGlobal: true,
    }),
    ConfigModule.forRoot({isGlobal: true}),
    DocumentModule,
  ],
  providers: [
    {provide: APP_INTERCEPTOR, useClass: CacheInterceptor}
  ]
})
export class AppModule {}
