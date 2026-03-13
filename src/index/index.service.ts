import {Injectable} from "@nestjs/common";
import {DocumentDto} from "../document/dto/document.dto";
import {IndexDto} from "./dto/index.dto";

@Injectable()
export class IndexService {
  constructor(
  ) {}

  private stopWords = [
    "de","que","e","em","entre","esse","se","enquanto","esses","essa","pelo","esta","este","onde","então","entanto","desde","nenhum","lhe","pelos","qualquer","quem","pela","porque","essas","elas","estes","sem","desses","deste","aqueles","destas","deles","sobre","é","com","na","das","para","mais","também","mas","uma","como","caso","da","nas","até","quando","qual","quais","ainda","quanto","através","portanto","ou","do","ao","por","no","um","porém","nos","não","contudo","dos","isto","pois","já","todos","tão","aos","todo","assim"
  ];

  tokenizeDocument(document: DocumentDto): string[] {
    const words = document.article.toLowerCase().split(' ');
    const keyWords = words.filter((word) => !this.stopWords.includes(word));

    return keyWords.reduce((acc, word) => {
      if (acc.includes(word)) return acc;

      acc.push(word.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''));

      return acc;
    }, [] as string[]);
  }

  getInvertedIndexes(document: DocumentDto, tokens: string[]) {
    const a = tokens.map((token) => {
      const result = this.findTokenOccurrences(document.article, token);
      return [document.id, result.count, result.indices];
    });

    console.log(a);
    return a as IndexDto[];
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