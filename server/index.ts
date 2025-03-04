import { PluginConfigDescriptor, PluginInitializerContext } from '../../../src/core/server';
import { configSchema, ConfigSchema } from '../common/config';
import { DataImporterPlugin } from './plugin';

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
