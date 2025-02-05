import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import type { VisualProps } from "../types/visual-props";
import {
  markdownComponents,
  extractTextFromChildren,
} from "../chart-visuals/markdown/markdown-component-helper";
import EmptyState from "../visual-utils/empty-state";

const Markdown = ({
  container: Container,
  header = "Markdown Content",
  subHeader = "",
  children,
  resize,
  DataStringQuery,
  ...props
}: VisualProps) => {
  const markdown = React.useMemo(() => {
    return extractTextFromChildren(children);
  }, [children]);

  if (!markdown) {
    const content = <EmptyState message="No markdown content available" />;
    return Container ? (
      <Container header="" {...props}>
        {content}
      </Container>
    ) : (
      content
    );
  }

  const content = (
    <div className="w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize], // Use custom schema
        ]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      resize={resize}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default Markdown;
