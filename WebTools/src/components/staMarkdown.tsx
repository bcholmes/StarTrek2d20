import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface ISTAMarkdown {
  children: string;
  className?: string;
}

export const STAMarkdown: React.FC<ISTAMarkdown> = ({
  children,
  className,
}) => {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      allowedElements={[
        'p',
        'strong',
        'u',
        'em',
        'i',
        'b',
        'ul',
        'ol',
        'li',
        'br',
      ]}
      className={className}
    >
      {children}
    </Markdown>
  );
};
