import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { VisualProps } from "../../types/visual-props";
import {
  markdownComponents,
  extractTextFromChildren,
} from "../../helpers/markdown-component-helper";

const Markdown = ({
  container: Container,
  header = "Markdown Content",
  subHeader = header,
  children,
}: VisualProps) => {
  const markdown = React.useMemo(() => {
    return extractTextFromChildren(children);
  }, [children]);

  const content = (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default Markdown;
