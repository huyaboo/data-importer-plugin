import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { SupportedFileTypes } from '../common/types';

export interface StaticDataIngestionPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StaticDataIngestionPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface ImportResponse {
  message: {
    total: number;
    success: boolean;
    message: string;
  };
  success: boolean;
}
