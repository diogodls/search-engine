import {IsNumber, IsOptional, IsString} from "class-validator";

export class DocumentDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString({message: 'The title must be string type.'})
  title: string;

  @IsString({message: 'The article must be string type.'})
  article: string;

  documentLength?: number;
}