import { PluginInitializerContext } from '../../../src/core/public';
import './index.scss';

import { DataImporterPlugin } from './plugin';

export function plugin(initializerContext: PluginInitializerContext) {
  return new DataImporterPlugin(initializerContext);
}

export { DataImporterPluginSetup, DataImporterPluginStart } from './types';
