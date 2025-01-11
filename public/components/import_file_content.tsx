import { EuiFilePicker } from '@elastic/eui';
import { SupportedFileTypes } from '../../common/types';
import React from 'react';

export interface ImportFileContentBodyProps {
  enabledFileTypes: SupportedFileTypes[];
  onFileUpdate: (file: File) => void;
}

export const ImportFileContentBody = ({
  enabledFileTypes,
  onFileUpdate,
}: ImportFileContentBodyProps) => {
  const acceptedFileExtensions = enabledFileTypes.map((fileType) => `.${fileType}`).join(', ');

  const onFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      onFileUpdate(files[0]);
    }
  };

  return (
    <EuiFilePicker
      fullWidth={true}
      display={'large'}
      accept={acceptedFileExtensions}
      onChange={onFileChange}
    />
  );
};
