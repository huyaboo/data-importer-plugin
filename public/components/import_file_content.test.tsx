import React from 'react';
import { render } from '@testing-library/react';
import { ImportFileContentBody } from './import_file_content';
import { SUPPORTED_FILE_TYPES_LIST } from '../../common';
import { SupportedFileTypes } from '../../common/types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-id'),
}));

describe('ImportFileContent', () => {
  it('should render', () => {
    const { container } = render(
      <ImportFileContentBody
        enabledFileTypes={SUPPORTED_FILE_TYPES_LIST as SupportedFileTypes[]}
        onFileUpdate={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
