import React, { useState } from 'react';

import {
  EuiCodeEditor,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageContentBody,
  EuiSelect,
  EuiText,
} from '@elastic/eui';
import { SupportedFileTypes } from '../../common/types';
import { JSON_FILE_TYPE } from '../../common/constants';

export interface ImportTextContentBodyProps {
  onTextChange: (text: string) => void;
  enabledFileTypes: SupportedFileTypes[];
  onFileTypeChange: (fileType: SupportedFileTypes) => void;
  characterLimit: number;
  initialFileType: SupportedFileTypes;
}

export const ImportTextContentBody = ({
  onTextChange,
  enabledFileTypes,
  onFileTypeChange,
  characterLimit,
  initialFileType,
}: ImportTextContentBodyProps) => {
  const [codeEditorText, setCodeEditorText] = useState<string>('');
  const [fileType, setFileType] = useState<SupportedFileTypes>(initialFileType);
  const [numCharacters, setNumCharacters] = useState<number>(0);
  const options = enabledFileTypes.map((type) => {
    return {
      value: type,
      text: type,
    };
  });

  const onTextUpdate = (text: string) => {
    setCodeEditorText(text);
    onTextChange(text);
    setNumCharacters(text.length);
  };

  const onOptionSelect = (e) => {
    setFileType(e.target.value === JSON_FILE_TYPE ? e.target.value : undefined);
    onFileTypeChange(e.target.value as SupportedFileTypes);
  };

  return (
    <EuiPageContentBody>
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiFlexGroup justifyContent="flexStart" gutterSize="s">
            <EuiFlexItem grow={false}>
              <EuiText>File Format: </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiSelect
                options={options}
                fullWidth={false}
                onChange={onOptionSelect}
                value={initialFileType}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCodeEditor
            onChange={onTextUpdate}
            width={'full'}
            value={codeEditorText}
            mode={fileType}
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText color={numCharacters > characterLimit ? 'danger' : 'default'}>
            {numCharacters}/{characterLimit} characters
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageContentBody>
  );
};
