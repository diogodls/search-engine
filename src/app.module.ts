import { Module } from '@nestjs/common';
import {DocumentModule} from "./document/document.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DocumentModule
  ]
})
export class AppModule {}
