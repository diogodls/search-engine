import {Inject, Injectable} from "@nestjs/common";
import {DocumentDto} from "../document/dto/document.dto";
import {InvertedIndex} from "./dto/index.dto";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import Cache from "cache-manager";

@Injectable()
export class IndexService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache.Cache
  ) {}

  private stopWords = [
    "de","que","e","a","o","em","entre","esse","se","enquanto","esses","essa","pelo","esta","este","onde","então","entanto","desde","nenhum","lhe","pelos","qualquer","quem","pela","porque","essas","elas","estes","sem","desses","deste","aqueles","destas","deles","sobre","é","com","na","das","para","mais","também","mas","uma","como","caso","da","nas","até","quando","qual","quais","ainda","quanto","através","portanto","ou","do","ao","por","no","um","porém","nos","não","contudo","dos","isto","pois","já","todos","tão","aos","todo","assim"
  ];
  private InvertedIndex: InvertedIndex = new Map<string, Map<number, number>>();

  getIndex() {
    return this.InvertedIndex;
  }

  cleanText(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '');
  }

  tokenizeDocument(document: DocumentDto): string[] {
    const cleaned = this.cleanText(document.article);
    const words = cleaned.split(/\s+/);

    return words
      .filter(word => !this.stopWords.includes(word));
  }

  getInvertedIndexes(document: DocumentDto, tokens: string[]) {
    const count = this.countTokens(tokens);

    tokens.forEach((token) => {
      if (!this.InvertedIndex.has(token)) {
        this.InvertedIndex.set(token, new Map());
      }

      this.InvertedIndex.get(token)!.set(document.id, count.get(token) || 0);
    });

    console.log(this.InvertedIndex);
  }

  countTokens(tokens: string[]) {
    const freq = new Map<string, number>();

    for (const token of tokens) {
      freq.set(token, (freq.get(token) || 0) + 1);
    }

    return freq;
  }
}