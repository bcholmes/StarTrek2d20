import {
  BoldItalicUnderlineToggles,
  MDXEditor,
  UndoRedo,
  toolbarPlugin,
} from '@mdxeditor/editor';
import React, { useState } from 'react';

interface IRichTextEditorProperties {
  initialText?: string;
  onChange: (string) => void;
}

export const RichTextEditor: React.FC<IRichTextEditorProperties> = ({
  initialText,
  onChange,
}) => {
  const [text, setText] = useState<string>(initialText ?? '');

  return (
    <MDXEditor
      markdown={text}
      className="w-100 dark-theme"
      plugins={[
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </>
          ),
        }),
      ]}
      onBlur={(e) => onChange(text)}
      onChange={(markdown) => setText(markdown)}
    />
  );
};
