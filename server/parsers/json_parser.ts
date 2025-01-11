import { Readable } from 'stream';
import { IFileParser, IngestOptions, ValidationOptions } from '../types';

export class JSONParser implements IFileParser {
  public async validateText(text: string, _: ValidationOptions) {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async ingestText(text: string, options: IngestOptions) {
    const { client, indexName } = options;
    const document = JSON.parse(text);
    await client.index({
      index: indexName,
      body: document,
    });
    return {
      total: 1,
      message: `Indexed 1 document`,
    };
  }

  public async ingestFile(file: Readable, options: IngestOptions) {
    const { client, indexName } = options;

    await new Promise((resolve, reject) => {
      let rawData = '';
      file
        .on('data', (chunk) => (rawData += chunk))
        .on('error', (e: any) => reject(e))
        .on('end', async () => {
          try {
            const document = JSON.parse(rawData);
            await client.index({
              index: indexName,
              body: document,
            });
          } catch (e) {
            reject(e);
          }
          resolve(undefined);
        });
    });

    return {
      total: 1,
      message: `Indexed 1 document`,
    };
  }
}
