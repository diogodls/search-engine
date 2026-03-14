import { Module } from '@nestjs/common';
import {DocumentModule} from "./document/document.module";
import {ConfigModule} from "@nestjs/config";
import {CacheInterceptor, CacheModule} from "@nestjs/cache-manager";
import {APP_INTERCEPTOR} from "@nestjs/core";

@Module({
  imports: [
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
