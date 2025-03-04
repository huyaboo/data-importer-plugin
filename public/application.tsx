import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { DataImporterPluginStartDependencies } from './types';
import { DataImporterPluginApp } from './components/data_importer_app';
import { PublicConfigSchema } from '../common/config';
import { DataImporterPluginSetupDeps } from './types';

export const renderApp = (
  { notifications, http, savedObjects }: CoreStart,
  { navigation }: DataImporterPluginStartDependencies,
  { appBasePath, element }: AppMountParameters,
  { dataSource, dataSourceManagement }: DataImporterPluginSetupDeps,
  config: PublicConfigSchema
) => {
  ReactDOM.render(
    <DataImporterPluginApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={navigation}
      config={config}
      savedObjects={savedObjects}
      dataSourceEnabled={!!dataSource}
      dataSourceManagement={dataSourceManagement}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
