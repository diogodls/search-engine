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

  // async setCacheKeys(key: string, value: string) {
  //   await this.cacheManager.set(key, value);
  // }
  //
  // async getCacheKeys(key: string): Promise<string | undefined> {
  //   return await this.cacheManager.get(key);
  // }

  private stopWords = [
    "de","que","e","a","o","em","entre","esse","se","enquanto","esses","essa","pelo","esta","este","onde","então","entanto","desde","nenhum","lhe","pelos","qualquer","quem","pela","porque","essas","elas","estes","sem","desses","deste","aqueles","destas","deles","sobre","é","com","na","das","para","mais","também","mas","uma","como","caso","da","nas","até","quando","qual","quais","ainda","quanto","através","portanto","ou","do","ao","por","no","um","porém","nos","não","contudo","dos","isto","pois","já","todos","tão","aos","todo","assim"
  ];
  private InvertedIndex: InvertedIndex = new Map<string, Map<number, number>>();

  normalizeString(str: string) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  tokenizeDocument(document: DocumentDto): string[] {
    const words = document.article.toLowerCase().split(' ');
    const keyWords = words.filter((word) => !this.stopWords.includes(word));

    return keyWords.reduce((acc, word) => {
      if (acc.includes(word)) return acc;

      acc.push(this.normalizeString(word));

      return acc;
    }, [] as string[]);
  }

  getInvertedIndexes(document: DocumentDto, tokens: string[]) {
    tokens.forEach((token) => {
      const result = this.findTokenOccurrences(this.normalizeString(document.article), token);
      console.log(token, document.id, result.count, result.indices);

      if (!this.InvertedIndex.has(token)) {
        this.InvertedIndex.set(token, new Map());
      }

      this.InvertedIndex.get(token)!.set(document.id, result.count);
    });

    console.log(this.InvertedIndex);
  }

  findTokenOccurrences(str: string, char: string) {
    let indices = [] as number[];
    let position = str.indexOf(char);

    while (position !== -1) {
      indices.push(position);
      position = str.indexOf(char, position + 1);
    }

    return {
      count: indices.length,
      indices: indices
    };
  }
}