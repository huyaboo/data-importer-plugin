import { OpenSearchClient } from 'opensearch-dashboards/server';
import { Readable } from 'stream';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginStart {}

export interface IngestOptions {
  client: OpenSearchClient;
  indexName: string;
  dataSourceId?: string;
}

export interface IFileParser {
  validateFile: (file: Readable) => Promise<boolean>;
  validateText: (text: string) => Promise<boolean>;
  ingestFile: (file: Readable, options: IngestOptions) => Promise<string>;
  ingestText: (text: string, options: IngestOptions) => Promise<string>;
}
