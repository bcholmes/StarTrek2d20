import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface ISTAMarkdown {
  children: string;
}

export const STAMarkdown: React.FC<ISTAMarkdown> = ({ children }) => {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      allowedElements={['p', 'strong', 'u', 'em', 'i', 'b']}
    >
      {children}
    </Markdown>
  );
};
