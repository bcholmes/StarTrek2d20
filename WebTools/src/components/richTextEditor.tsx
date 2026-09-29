import React from 'react';
import { TextArea } from '../common/textarea';

interface IRichTextEditorProperties {
  initialText?: string;
  onChange: (string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<IRichTextEditorProperties> = ({
  initialText,
  onChange,
  placeholder,
}) => {

  return (
    <TextArea
      value={initialText}
      placeholder={placeholder}
      onChange={(e) => onChange(e)}
    />
  );
};
