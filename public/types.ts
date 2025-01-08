import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface StaticDataIngestionPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
