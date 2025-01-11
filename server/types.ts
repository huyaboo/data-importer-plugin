import { OpenSearchClient } from 'opensearch-dashboards/server';
import { Readable } from 'stream';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginStart {}

export interface IngestOptions {
  client: OpenSearchClient;
  indexName: string;
  delimiter?: string;
  dataSourceId?: string;
}

export interface IngestResponse {
  total: number;
  success: boolean;
  message: string;
}

export interface ValidationOptions {
  delimiter?: string;
}

export interface IFileParser {
  validateText: (text: string, options: ValidationOptions) => Promise<boolean>;
  ingestFile: (file: Readable, options: IngestOptions) => Promise<IngestResponse>;
  ingestText: (text: string, options: IngestOptions) => Promise<IngestResponse>;
}
