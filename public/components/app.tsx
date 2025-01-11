import React, { useEffect, useState } from 'react';
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
  EuiSelect,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID } from '../../common';
import {
  ImportChoices,
  ImportTypeSelector,
  IMPORT_CHOICE_FILE,
  IMPORT_CHOICE_TEXT,
} from './import_type';
import { importFile } from '../lib/import_file';
import { importText } from '../lib/import_text';
import { ImportResponse } from '../types';
import { SupportedFileTypes } from '../../common/types';
import { DataSourceOption } from 'src/plugins/data_source_management/public';
import { ConfigSchema } from '../../config';
import { ImportTextContentBody } from './import_text_content';
import { ImportFileContentBody } from './import_file_content';
import { CSV_FILE_TYPE, CSV_SUPPORTED_DELIMITERS } from '../../common/constants';
import { extname } from 'path';

interface StaticDataIngestionAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  config: ConfigSchema;
}

export const StaticDataIngestionApp = ({
  basename,
  notifications,
  http,
  navigation,
  config,
}: StaticDataIngestionAppDeps) => {
  const [indexName, setIndexName] = useState<string>();
  const [importType, setImportType] = useState<ImportChoices>(IMPORT_CHOICE_FILE);
  const [disableImport, setDisableImport] = useState<boolean>();
  const [dataType, setDataType] = useState<SupportedFileTypes | undefined>(
    config.enabledFileTypes.length > 0 ? config.enabledFileTypes[0] : undefined
  );
  const [inputText, setText] = useState<string | undefined>();
  const [inputFile, setInputFile] = useState<File | undefined>();
  const [dataSourceId, setDataSourceId] = useState<string | undefined>();
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

  const onIndexNameChange = (e) => {
    setIndexName(e.target.value);
  };

  const onDataTypeChange = (type: SupportedFileTypes) => {
    if (type != CSV_FILE_TYPE) {
      setDelimiter(undefined);
    }
    setDataType(type);
  };

  const onFileInput = (file: File) => {
    setInputFile(file);
  };

  const onTextInput = (text: string) => {
    setText(text);
  };

  const onDelimiterChange = (e) => {
    setDelimiter(e.target.value);
  };

  const onDataSourceSelect = (selectedDataSource: DataSourceOption[]) => {
    if (selectedDataSource.length > 0) {
      setDataSourceId(selectedDataSource[0].id);
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
        i18n.translate('staticDataIngestion.dataImportFailed', {
          defaultMessage: `Data import failed: ${error}`,
        })
      );
      return;
    }

    if (response && response.success) {
      notifications.toasts.addSuccess(
        i18n.translate('staticDataIngestion.dataImported', {
          defaultMessage: `${response.message.total} documents successfully ingested into ${indexName}`,
        })
      );
    } else {
      notifications.toasts.addDanger(
        i18n.translate('staticDataIngestion.dataImportFailed', {
          defaultMessage: 'Data import failed',
        })
      );
    }
  };

  useEffect(() => {
    setDisableImport(shouldDisableImportButton());
    addDangerToasts();
    setShowDelimiterChoice(shouldShowDelimiter());
  }, [importType, inputText, inputFile, dataType, indexName]);

  const addDangerToasts = () => {
    if (inputText && inputText.length > config.maxTextCount) {
      notifications.toasts.addDanger(
        i18n.translate('staticDataIngestion.textTooLong', {
          defaultMessage: `Text exceeds ${config.maxTextCount} characters`,
        })
      );
    }

    if (inputFile && inputFile.size > config.maxFileSizeBytes) {
      notifications.toasts.addDanger(
        i18n.translate('staticDataIngestion.fileTooLarge', {
          defaultMessage: `File is too large`,
        })
      );
    }
  };

  const shouldDisableImportButton = () => {
    const validFileType =
      importType === IMPORT_CHOICE_FILE && inputFile && inputFile.size < config.maxFileSizeBytes;
    const validTextType =
      importType === IMPORT_CHOICE_TEXT &&
      inputText &&
      inputText.length < config.maxTextCount &&
      dataType;
    return !(validFileType || validTextType) || !indexName;
  };

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
                <div>
                  <EuiTitle size="xs">
                    <span>
                      {i18n.translate('staticDataIngestion.importType', {
                        defaultMessage: 'Delimiter',
                      })}
                    </span>
                  </EuiTitle>
                  <EuiSelect
                    options={CSV_SUPPORTED_DELIMITERS.map((delimiter: string) => {
                      return { value: delimiter, text: delimiter };
                    })}
                    onChange={onDelimiterChange}
                    value={delimiter}
                  />
                </div>
              )}
              <EuiFieldText placeholder="Index name" onChange={onIndexNameChange} />
              <EuiButton fullWidth={false} isDisabled={disableImport} onClick={importData}>
                Import
              </EuiButton>
            </EuiPageSideBar>
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="staticDataIngestion.helloWorldText"
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
                          id="staticDataIngestion.congratulationsTitle"
                          defaultMessage="Import Data"
                        />
                      )}
                      {importType === IMPORT_CHOICE_FILE && (
                        <FormattedMessage
                          id="staticDataIngestion.congratulationsTitle"
                          defaultMessage="Import Data from File"
                        />
                      )}
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                {importType === IMPORT_CHOICE_TEXT && (
                  <ImportTextContentBody
                    onTextChange={onTextInput}
                    enabledFileTypes={config.enabledFileTypes}
                    initialFileType={dataType}
                    characterLimit={config.maxTextCount}
                    onFileTypeChange={onDataTypeChange}
                  />
                )}
                {importType === IMPORT_CHOICE_FILE && (
                  <ImportFileContentBody
                    enabledFileTypes={config.enabledFileTypes}
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
