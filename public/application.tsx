import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { StaticDataIngestionApp } from './components/app';
import { ConfigSchema } from '../config';

export const renderApp = (
  { notifications, http }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { appBasePath, element }: AppMountParameters,
  config: ConfigSchema
) => {
  ReactDOM.render(
    <StaticDataIngestionApp
      basename={appBasePath}
      notifications={notifications}
      http={http}
      navigation={navigation}
      config={config}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
