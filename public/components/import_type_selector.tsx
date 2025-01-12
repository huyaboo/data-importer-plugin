import React, { useState } from 'react';
import {
  EuiFormFieldset,
  EuiTitle,
  EuiCheckableCard,
  EuiText,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIconTip,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';

export const IMPORT_CHOICE_TEXT = 'text';
export const IMPORT_CHOICE_FILE = 'file';
export type ImportChoices = typeof IMPORT_CHOICE_TEXT | typeof IMPORT_CHOICE_FILE;

const createLabel = ({ text, tooltip }: { text: string; tooltip: string }) => (
  <EuiFlexGroup>
    <EuiFlexItem>
      <EuiText>{text}</EuiText>
    </EuiFlexItem>
    <EuiFlexItem grow={false}>
      <EuiIconTip content={tooltip} position="left" type="iInCircle" />
    </EuiFlexItem>
  </EuiFlexGroup>
);

export interface ImportTypeSelectorProps {
  updateSelection: (selection: ImportChoices) => void;
  initialSelection?: ImportChoices;
}

export const ImportTypeSelector = ({
  updateSelection,
  initialSelection,
}: ImportTypeSelectorProps) => {
  const [importType, setImportType] = useState(initialSelection || IMPORT_CHOICE_FILE);

  const onChange = (choice: ImportChoices) => {
    setImportType(choice);
    updateSelection(choice);
  };

  return (
    <EuiFormFieldset
      legend={{
        children: (
          <EuiTitle size="xs">
            <span>
              {i18n.translate('dataImporterPlugin.importType', {
                defaultMessage: 'Import Type',
              })}
            </span>
          </EuiTitle>
        ),
      }}
    >
      <EuiCheckableCard
        id={'file-selection'}
        label={createLabel({
          text: i18n.translate('dataImporterPlugin.file', {
            defaultMessage: 'Upload from file',
          }),
          tooltip: i18n.translate('dataImporterPlugin.fileTooltip', {
            defaultMessage: 'Upload data from a file',
          }),
        })}
        checked={importType === IMPORT_CHOICE_FILE}
        onChange={() => onChange(IMPORT_CHOICE_FILE)}
      />

      <EuiSpacer size="s" />

      <EuiCheckableCard
        id={'text-selection'}
        label={createLabel({
          text: i18n.translate('dataImporterPlugin.file', {
            defaultMessage: 'Text box',
          }),
          tooltip: i18n.translate('dataImporterPlugin.fileTooltip', {
            defaultMessage: 'Type/paste data',
          }),
        })}
        checked={importType === IMPORT_CHOICE_TEXT}
        onChange={() => onChange(IMPORT_CHOICE_TEXT)}
      />

      <EuiSpacer size="m" />
    </EuiFormFieldset>
  );
};
