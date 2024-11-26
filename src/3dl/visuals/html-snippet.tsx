import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

interface HtmlSnippetProps {
  url: string;
  className?: string;
}

export const HtmlSnippet: React.FC<HtmlSnippetProps> = ({ url, className }) => {
  const { state: { config } } = useAppState();
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const fullUrl = `${config?.settings?.serverBaseURL}${url}`;
        const response = await fetch(fullUrl);
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

    if (config?.settings?.serverBaseURL) {
      fetchHtml();
    }
  }, [url, config?.settings?.serverBaseURL]);

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

export default HtmlSnippet;