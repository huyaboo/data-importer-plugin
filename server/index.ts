import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { configSchema, ConfigSchema } from '../config';
import { DataImporterPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export const config: PluginConfigDescriptor<ConfigSchema> = {
  schema: configSchema,
  exposeToBrowser: {
    enabledFileTypes: true,
    maxFileSizeBytes: true,
    maxTextCount: true,
  },
};

export function plugin(initializerContext: PluginInitializerContext) {
  return new DataImporterPlugin(initializerContext);
}

export * from './types';
