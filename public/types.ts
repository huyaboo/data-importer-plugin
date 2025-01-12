import { DataSourceManagementPluginSetup } from 'src/plugins/data_source_management/public';
import { DataSourcePluginSetup } from 'src/plugins/data_source/public';
import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface DataImporterPluginSetupDeps {
  dataSourceManagement?: DataSourceManagementPluginSetup;
  dataSource?: DataSourcePluginSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataImporterPluginSetup {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DataImporterPluginStart {}

export interface DataImporterPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}

export interface ImportResponse {
  message: {
    total: number;
    message: string;
  };
  success: boolean;
}
