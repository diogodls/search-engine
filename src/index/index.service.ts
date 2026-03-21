import {Inject, Injectable} from "@nestjs/common";
import {DocumentDto} from "../document/dto/document.dto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import Cache from "cache-manager";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {Term} from "../models/term.entity";
import {TermDocument} from "../models/terms_document.entity";

@Injectable()
export class IndexService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache.Cache,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(TermDocument)
    private termDocumentRepository: Repository<TermDocument>,
  ) {}

  private stopWords = [
    "de","que","e","a","o","em","entre","esse","se","enquanto","esses","essa","pelo","esta","este","onde","então","entanto","desde","nenhum","lhe","pelos","qualquer","quem","pela","porque","essas","elas","estes","sem","desses","deste","aqueles","destas","deles","sobre","é","com","na","das","para","mais","também","mas","uma","como","caso","da","nas","até","quando","qual","quais","ainda","quanto","através","portanto","ou","do","ao","por","no","um","porém","nos","não","contudo","dos","isto","pois","já","todos","tão","aos","todo","assim"
  ];

  cleanText(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '');
  }

  filterStopWords(str: string) {
   const filteredString = str.split(/\s+/).filter(word => !this.stopWords.includes(word));

   return [...new Set(filteredString)];
  }

  tokenizeDocument(document: DocumentDto): string[] {
    const cleaned = this.cleanText(document.article);

    return this.filterStopWords(cleaned);
  }

  async createIndexes(document: DocumentDto) {
    const tokenizedDocument = this.tokenizeDocument(document);
    const uniqueTokens = Array.from(new Set(tokenizedDocument));
    const existingTerms = await this.termRepository.findBy({ term: In(uniqueTokens) });

    await this.saveTerms(uniqueTokens, existingTerms);

    const allTerms = await this.termRepository.findBy({ term: In(uniqueTokens) });

    await this.saveTermDocument(tokenizedDocument, allTerms, document.id);
  }

  async saveTerms(uniqueTokens: string[], existingTerms: Term[]) {
    const existingSet = new Set(existingTerms.map(t => t.term));

    const newTerms = uniqueTokens
        .filter(token => !existingSet.has(token))
        .map(token => ({ term: token }));

    if (newTerms.length > 0) {
      await this.termRepository.save(newTerms);
    }
  }

  async saveTermDocument(tokenizedDocument: string[], existingTerms: Term[], documentId: number) {
    const termIdMap = new Map<string, number>();

    existingTerms.forEach(term => {
      termIdMap.set(term.term, term.id);
    });

    const terms = tokenizedDocument.map((token, index) => {
      return {
        termId: termIdMap.get(token) as number,
        documentId: documentId,
        position: index,
      }
    });

    await this.termDocumentRepository.save(terms);
  }
}