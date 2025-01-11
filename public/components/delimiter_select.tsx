import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiTitle, EuiSelect } from '@elastic/eui';
import { CSV_SUPPORTED_DELIMITERS } from '../../common/constants';

export interface DelimiterSelectProps {
  showDelimiterChoice: boolean;
  onDelimiterChange: (delimiter: any) => void;
  initialDelimiter?: string;
}

export const DelimiterSelect = ({ onDelimiterChange, initialDelimiter }: DelimiterSelectProps) => {
  return (
    <div>
      <EuiTitle size="xs">
        <span>
          {i18n.translate('dataImporterPlugin.importType', {
            defaultMessage: 'Delimiter',
          })}
        </span>
      </EuiTitle>
      <EuiSelect
        options={CSV_SUPPORTED_DELIMITERS.map((delimiterCharacter: string) => {
          return { value: delimiterCharacter, text: delimiterCharacter };
        })}
        onChange={onDelimiterChange}
        value={initialDelimiter}
      />
    </div>
  );
};
