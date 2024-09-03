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
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <textarea
          ref={queryRef}
          placeholder="Type your query here..."
          style={{
            width: "75%",
            height: "150px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid black",
            resize: "none",
            marginRight: "10px",
            outline: "none",
          }}
          // onFocus={(e) => (e.target.style.borderColor = "#C42783")}
          // onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <button
          onClick={handleUpdateQuery}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "4px",
            backgroundColor: "#C42783",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update Query
        </button>
      </div>
      {query && children && React.cloneElement(children, { query })}
    </>
  );

  return Container ? <Container>{content}</Container> : content;
};

export default PreviewQuery;
