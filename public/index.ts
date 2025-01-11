import './index.scss';

import { StaticDataIngestionPlugin } from './plugin';
import { PluginInitializerContext } from 'opensearch-dashboards/public';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new StaticDataIngestionPlugin(initializerContext);
}
export { StaticDataIngestionPluginSetup, StaticDataIngestionPluginStart } from './types';
