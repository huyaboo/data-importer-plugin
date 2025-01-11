import { CSV_FILE_TYPE, JSON_FILE_TYPE, NDJSON_FILE_TYPE } from './constants';

export type SupportedFileTypes =
  | typeof CSV_FILE_TYPE
  | typeof JSON_FILE_TYPE
  | typeof NDJSON_FILE_TYPE;
