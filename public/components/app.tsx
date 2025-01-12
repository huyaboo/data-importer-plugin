import React, { useEffect, useMemo, useState } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiPageSideBar,
  EuiFieldText,
  EuiSpacer,
} from '@elastic/eui';
import {
  DataSourceManagementPluginSetup,
  DataSourceOption,
  DataSourceSelectableConfig,
} from 'src/plugins/data_source_management/public';
import { extname } from 'path';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { PLUGIN_ID } from '../../common';
import {
  ImportChoices,
  ImportTypeSelector,
  IMPORT_CHOICE_FILE,
  IMPORT_CHOICE_TEXT,
} from './import_type_selector';
import { importFile } from '../lib/import_file';
import { importText } from '../lib/import_text';
import { ImportResponse } from '../types';
import { SupportedFileTypes } from '../../common/types';
import { PublicConfigSchema } from '../../config';
import { ImportTextContentBody } from './import_text_content';
import { ImportFileContentBody } from './import_file_content';
import { CSV_FILE_TYPE, CSV_SUPPORTED_DELIMITERS } from '../../common/constants';
import { DelimiterSelect } from './delimiter_select';

interface DataImporterPluginAppProps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  savedObjects: CoreStart['savedObjects'];
  navigation: NavigationPublicPluginStart;
  config: PublicConfigSchema;
  dataSourceEnabled: boolean;
  dataSourceManagement?: DataSourceManagementPluginSetup;
}

export const DataImporterPluginApp = ({
  basename,
  notifications,
  http,
  navigation,
  config,
  savedObjects,
  dataSourceEnabled,
  dataSourceManagement,
}: DataImporterPluginAppProps) => {
  const DataSourceMenu = dataSourceManagement?.ui.getDataSourceMenu<DataSourceSelectableConfig>();
  const [indexName, setIndexName] = useState<string>();
  const [importType, setImportType] = useState<ImportChoices>(IMPORT_CHOICE_FILE);
  const [disableImport, setDisableImport] = useState<boolean>();
  const [dataType, setDataType] = useState<SupportedFileTypes | undefined>(
    config.enabledFileTypes.length > 0
      ? (config.enabledFileTypes[0] as SupportedFileTypes)
      : undefined
  );
  const [inputText, setText] = useState<string | undefined>();
  const [inputFile, setInputFile] = useState<File | undefined>();
  const [dataSourceId, setDataSourceId] = useState<string | undefined>();
  const [selectedDataSource, setSelectedDataSource] = useState<DataSourceOption | undefined>();
  const [showDelimiterChoice, setShowDelimiterChoice] = useState<boolean>(shouldShowDelimiter());
  const [delimiter, setDelimiter] = useState<string | undefined>(
    dataType === CSV_FILE_TYPE ? CSV_SUPPORTED_DELIMITERS[0] : undefined
  );

  const onImportTypeChange = (type: ImportChoices) => {
    if (type === IMPORT_CHOICE_FILE) {
      setInputFile(undefined);
    } else if (type === IMPORT_CHOICE_TEXT) {
      setText(undefined);
    }
    setImportType(type);
  };

  const onIndexNameChange = (e: any) => {
    setIndexName(e.target.value);
  };

  const onDataTypeChange = (type: SupportedFileTypes) => {
    if (type !== CSV_FILE_TYPE) {
      setDelimiter(undefined);
    }
    setDataType(type);
  };

  const onFileInput = (file?: File) => {
    setInputFile(file);
  };

  const onTextInput = (text: string) => {
    setText(text);
  };

  const onDelimiterChange = (e: any) => {
    setDelimiter(e.target.value);
  };

  const onDataSourceSelect = (newDataSource: DataSourceOption[]) => {
    if (newDataSource.length > 0) {
      setDataSourceId(newDataSource[0].id);
      setSelectedDataSource(newDataSource[0]);
    }
  };

  const importData = async () => {
    let response: ImportResponse | undefined;

    try {
      if (importType === IMPORT_CHOICE_FILE) {
        response = await importFile(http, inputFile!, indexName!, delimiter, dataSourceId);
      } else if (importType === IMPORT_CHOICE_TEXT) {
        response = await importText(
          http,
          inputText!,
          dataType!,
          indexName!,
          delimiter,
          dataSourceId
        );
      }
    } catch (error) {
      notifications.toasts.addDanger(
        i18n.translate('dataImporterPlugin.dataImportFailed', {
          defaultMessage: `Data import failed: ${error}`,
        })
      );
      return;
    }

    if (response && response.success) {
      notifications.toasts.addSuccess(
        i18n.translate('dataImporterPlugin.dataImported', {
          defaultMessage: `${response.message.total} documents successfully ingested into ${indexName}`,
        })
      );
    } else {
      const errorMessage = response ? `: ${response.message.message}` : '';
      notifications.toasts.addDanger(
        i18n.translate('dataImporterPlugin.dataImportFailed', {
          defaultMessage: `Data import failed${errorMessage}`,
        })
      );
    }
  };

  useEffect(() => {
    setDisableImport(shouldDisableImportButton());
    setShowDelimiterChoice(shouldShowDelimiter());
  }, [importType, inputText, inputFile, dataType, indexName]);

  useEffect(() => {
    if (inputText && inputText.length > config.maxTextCount) {
      notifications.toasts.addDanger(
        i18n.translate('dataImporterPlugin.textTooLong', {
          defaultMessage: `Text exceeds ${config.maxTextCount} characters`,
        })
      );
    }

    if (inputFile && inputFile.size > config.maxFileSizeBytes) {
      notifications.toasts.addDanger(
        i18n.translate('dataImporterPlugin.fileTooLarge', {
          defaultMessage: `File is too large`,
        })
      );
    }
  }, [inputText, inputFile]);

  const renderDataSourceComponent = useMemo(() => {
    return (
      <div>
        <DataSourceMenu
          dataSourceManagement={dataSourceManagement}
          componentType={'DataSourceSelectable'}
          componentConfig={{
            fullWidth: true,
            savedObjects: savedObjects.client,
            notifications,
            onSelectedDataSources: onDataSourceSelect,
            selectedOption: selectedDataSource,
          }}
        />
        <EuiSpacer size="m" />
      </div>
    );
  }, [savedObjects, notifications]);

  function shouldDisableImportButton() {
    const validFileType =
      importType === IMPORT_CHOICE_FILE && inputFile && inputFile.size < config.maxFileSizeBytes;
    const validTextType =
      importType === IMPORT_CHOICE_TEXT &&
      inputText &&
      inputText.length < config.maxTextCount &&
      dataType;
    return !(validFileType || validTextType) || !indexName;
  }

  function shouldShowDelimiter() {
    let inputFileType;
    if (inputFile) {
      const fileExtention = extname(inputFile.name).toLowerCase();
      inputFileType = fileExtention.startsWith('.') ? fileExtention.slice(1) : fileExtention;
    }
    return (
      (importType === IMPORT_CHOICE_FILE && inputFile && inputFileType === CSV_FILE_TYPE) ||
      (importType === IMPORT_CHOICE_TEXT && dataType === CSV_FILE_TYPE)
    );
  }

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu appName={PLUGIN_ID} useDefaultBehaviors={true} />
          <EuiPage>
            <EuiPageSideBar>
              <ImportTypeSelector
                updateSelection={onImportTypeChange}
                initialSelection={importType}
              />
              {showDelimiterChoice && (
                <DelimiterSelect onDelimiterChange={onDelimiterChange} value={delimiter} />
              )}
              <EuiTitle size="xs">
                <span>
                  {i18n.translate('dataImporterPlugin.importType', {
                    defaultMessage: 'Data Source Options',
                  })}
                </span>
              </EuiTitle>
              <EuiFieldText placeholder="Index name" onChange={onIndexNameChange} />
              <EuiSpacer size="m" />
              {dataSourceEnabled && renderDataSourceComponent}
              <EuiButton fullWidth={true} isDisabled={disableImport} onClick={importData}>
                Import
              </EuiButton>
            </EuiPageSideBar>
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="dataImporterPlugin.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: 'Data Importer Plugin' }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      {importType === IMPORT_CHOICE_TEXT && (
                        <FormattedMessage
                          id="dataImporterPlugin.congratulationsTitle"
                          defaultMessage="Import Data"
                        />
                      )}
                      {importType === IMPORT_CHOICE_FILE && (
                        <FormattedMessage
                          id="dataImporterPlugin.congratulationsTitle"
                          defaultMessage="Import Data from File"
                        />
                      )}
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                {importType === IMPORT_CHOICE_TEXT && (
                  <ImportTextContentBody
                    onTextChange={onTextInput}
                    enabledFileTypes={config.enabledFileTypes as SupportedFileTypes[]}
                    initialFileType={dataType as SupportedFileTypes}
                    characterLimit={config.maxTextCount}
                    onFileTypeChange={onDataTypeChange}
                  />
                )}
                {importType === IMPORT_CHOICE_FILE && (
                  <ImportFileContentBody
                    enabledFileTypes={config.enabledFileTypes as SupportedFileTypes[]}
                    onFileUpdate={onFileInput}
                  />
                )}
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
