import type { ReactElement, ReactNode } from "react";
import React, { useRef, useState } from "react";

interface PreviewQueryProps {
  children?: ReactElement<{ query?: string }>;
  container?: React.ComponentType<{ children: ReactNode }>;
}

const PreviewQuery: React.FC<PreviewQueryProps> = ({
  children,
  container: Container,
}) => {
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState<string>("");

  const handleUpdateQuery = () => {
    const queryValue = queryRef.current?.value;
    if (queryValue) {
      setQuery(queryValue);
    }
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <textarea
        ref={queryRef}
        placeholder="Type your query here..."
        style={{
          width: "50%",
          height: "150px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          resize: "none",
          marginBottom: "10px",
        }}
      />
      <button
        onClick={handleUpdateQuery}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "4px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Update Query
      </button>
      {query && children && React.cloneElement(children, { query })}
    </div>
  );

  return Container ? <Container>{content}</Container> : content;
};

export default PreviewQuery;
