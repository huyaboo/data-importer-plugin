import React from 'react';
import { DataImporterPluginApp } from './data_importer_app';
import { coreMock } from '../../../../src/core/public/mocks';
import { testDataSourceManagementPlugin } from '../../../../src/plugins/data_source_management/public/mocks';
import { PublicConfigSchema } from '../../config';
import { navigationPluginMock } from '../../../../src/plugins/navigation/public/mocks';
import { shallow } from 'enzyme';
import { SUPPORTED_FILE_TYPES_LIST } from '../../common';

describe('App', () => {
  const notificationsMock = coreMock.createStart().notifications;
  const httpMock = coreMock.createStart().http;
  const savedObjectsMock = coreMock.createStart().savedObjects;
  const navigationMock = navigationPluginMock.createStartContract();
  const mockConfig: PublicConfigSchema = {
    enabledFileTypes: SUPPORTED_FILE_TYPES_LIST,
    maxFileSizeBytes: 104857600,
    maxTextCount: 10000,
  };

  it('should render without MDS', () => {
    const container = shallow(
      <DataImporterPluginApp
        basename={'dataImporterPlugin'}
        notifications={notificationsMock}
        http={httpMock}
        savedObjects={savedObjectsMock}
        navigation={navigationMock}
        config={mockConfig}
        dataSourceEnabled={false}
        dataSourceManagement={undefined}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with MDS', () => {
    const dataSourceManagementMock = testDataSourceManagementPlugin(
      coreMock.createSetup(),
      coreMock.createStart()
    ).setup;

    // @ts-expect-error
    dataSourceManagementMock.ui.getDataSourceMenu = jest.fn(() => <div>DataSourceMenu</div>);

    const container = shallow(
      <DataImporterPluginApp
        basename={'dataImporterPlugin'}
        notifications={notificationsMock}
        http={httpMock}
        savedObjects={savedObjectsMock}
        navigation={navigationMock}
        config={mockConfig}
        dataSourceEnabled={true}
        dataSourceManagement={dataSourceManagementMock}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
