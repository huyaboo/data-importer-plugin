import { schema, TypeOf } from '@osd/config-schema';

export const configSchema = schema.object({
  enabledFileTypes: schema.arrayOf(
    schema.oneOf([schema.literal('csv'), schema.literal('json'), schema.literal('ndjson')]),
    {
      defaultValue: [],
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
