import React, { useState, useEffect } from 'react';

interface HtmlSnippetProps {
  url: string;
  className?: string;
}

export const HtmlSnippet: React.FC<HtmlSnippetProps> = ({ url, className }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        setContent(html);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setContent('');
      }
    };

    fetchHtml();
  }, [url]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
