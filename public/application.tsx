import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { DataImporterPluginStartDependencies } from './types';
import { DataImporterPluginApp } from './components/app';
import { PublicConfigSchema } from '../config';
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
