import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface DataImporterPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataImporterPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface ImportResponse {
  message: {
    total: number;
    message: string;
  };
  success: boolean;
}
