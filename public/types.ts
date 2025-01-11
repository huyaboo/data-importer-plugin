import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataImporterPluginSetup {}
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
