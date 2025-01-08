import { IFileParser, IngestOptions } from '../types';
import { parseStream, parseString } from 'fast-csv';
import { Readable } from 'stream';

export class CSVParser implements IFileParser {
  public async validateFile(file: Readable) {
    let result = false;
    parseStream(file, { headers: true }).on('end', () => (result = true));
    return result;
  }

  public async validateText(text: string) {
    let result = false;
    parseString(text, { headers: true }).on('end', () => (result = true));
    return result;
  }

  public async ingestFile(file: Readable, options: IngestOptions) {
    const { client, indexName } = options;
    let numDocuments = 0;

    parseStream(file, { headers: true })
      .on('data', (row) => {
        client.index({
          index: indexName,
          body: row,
        });
      })
      .on('end', (rowCount: number) => (numDocuments = rowCount));

    return `Indexed ${numDocuments} documents`;
  }

  public async ingestText(text: string, options: IngestOptions) {
    const { client, indexName } = options;
    let numDocuments = 0;

    parseString(text, { headers: true })
      .on('data', (row) => {
        client.index({
          index: indexName,
          body: row,
        });
      })
      .on('end', (rowCount: number) => (numDocuments = rowCount));

    return `Indexed ${numDocuments} documents`;
  }
}
