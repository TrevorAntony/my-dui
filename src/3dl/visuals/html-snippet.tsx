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
        console.log("Attempting to fetch from URL:", `${config?.serverBaseURL}${url}`);
        const fullUrl = `${config?.serverBaseURL}${url}`;
        const response = await fetch(fullUrl, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        // Replace {baseurl} with actual serverBaseURL
        const processedHtml = html.replace(/\{baseurl\}/g, config?.serverBaseURL || '');
        setContent(processedHtml);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        setContent('');
      }
    };

    if (config?.serverBaseURL) {
      fetchHtml();
    } else {
    }
  }, [url, config?.serverBaseURL]);

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