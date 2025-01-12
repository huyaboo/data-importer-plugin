import { schema, TypeOf } from '@osd/config-schema';
import { CSV_FILE_TYPE, JSON_FILE_TYPE, NDJSON_FILE_TYPE } from './common/constants';

export const configSchema = schema.object({
  enabledFileTypes: schema.arrayOf(
    schema.oneOf([
      schema.literal(CSV_FILE_TYPE),
      schema.literal(JSON_FILE_TYPE),
      schema.literal(NDJSON_FILE_TYPE),
    ]),
    {
      defaultValue: [CSV_FILE_TYPE, JSON_FILE_TYPE, NDJSON_FILE_TYPE],
    }
  ),
  maxFileSizeBytes: schema.number({
    defaultValue: 100000000,
  }),
  maxTextCount: schema.number({
    defaultValue: 10000,
  }),
});

export type ConfigSchema = TypeOf<typeof configSchema>;
export type PublicConfigSchema = ConfigSchema;
