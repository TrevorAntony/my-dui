import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { VisualProps } from "../../types/visual-props";
import {
  markdownComponents,
  extractTextFromChildren,
} from "../../helpers/markdown-component-helper";
import EmptyState from "../ui-elements/empty-state";

const Markdown = ({
  container: Container,
  header = "Markdown Content",
  subHeader = header,
  children,
  resize,
  ...props
}: VisualProps) => {
  const markdown = React.useMemo(() => {
    return extractTextFromChildren(children);
  }, [children]);

  if (!markdown) {
    const content = <EmptyState message="No markdown content available" />;
    return Container ? (
      <Container header={""} {...props}>
        {content}
      </Container>
    ) : (
      content
    );
  }

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
    <Container header={header} subHeader={subHeader} resize={resize}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default Markdown;
