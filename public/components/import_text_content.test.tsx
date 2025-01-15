import React from 'react';
import { render } from '@testing-library/react';
import { ImportTextContentBody } from './import_text_content';
import { SupportedFileTypes } from '../../common/types';
import { SUPPORTED_FILE_TYPES_LIST } from '../../common';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-id'),
}));

describe('ImportTextContent', () => {
  it('should render', () => {
    const { container } = render(
      <ImportTextContentBody
        onTextChange={jest.fn()}
        enabledFileTypes={SUPPORTED_FILE_TYPES_LIST as SupportedFileTypes[]}
        onFileTypeChange={jest.fn()}
        characterLimit={10000}
        initialFileType={SUPPORTED_FILE_TYPES_LIST[0] as SupportedFileTypes}
      />
    );

    // These id fields cannot be manually set
    container.querySelector('div.ace_editor')?.removeAttribute('id');
    container.querySelector('button.euiCodeEditorKeyboardHint')?.removeAttribute('id');

    expect(container).toMatchSnapshot();
  });
});
