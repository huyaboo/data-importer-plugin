import './index.scss';

import { StaticDataIngestionPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new StaticDataIngestionPlugin();
}
export { StaticDataIngestionPluginSetup, StaticDataIngestionPluginStart } from './types';
