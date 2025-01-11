import './index.scss';

import { PluginInitializerContext } from 'opensearch-dashboards/public';
import { DataImporterPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new DataImporterPlugin(initializerContext);
}
export { DataImporterPluginSetup, DataImporterPluginStart } from './types';
