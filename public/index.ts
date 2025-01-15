import { PluginInitializerContext } from '../../../src/core/public';
import './index.scss';

import { DataImporterPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new DataImporterPlugin(initializerContext);
}
export { DataImporterPluginSetup, DataImporterPluginStart } from './types';
