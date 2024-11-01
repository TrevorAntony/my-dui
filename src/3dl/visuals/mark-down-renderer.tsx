import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { VisualProps } from "../../types/visual-props";

const MarkdownRendererComponent = ({
  container: Container,
  header = "Markdown Content",
  subHeader = header,
  children,
}: VisualProps) => {
  const content = (
    <div className="prose max-w-none">{renderChildren(children)}</div>
  );

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

function renderChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a className="text-blue-600 underline" {...props}>
              {children}
            </a>
          ),
          ul: ({ ...props }) => <ul className="ml-5 list-disc" {...props} />,
          table: ({ ...props }) => (
            <table className="min-w-full divide-y divide-gray-200" {...props} />
          ),
          th: ({ ...props }) => (
            <th
              className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td className="whitespace-nowrap px-6 py-4" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    );
  } else if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{renderChildren(child)}</React.Fragment>
    ));
  } else if (React.isValidElement(children)) {
    if (children.props && children.props.children) {
      const newProps = {
        ...children.props,
        children: renderChildren(children.props.children),
      };
      return React.cloneElement(children, newProps);
    } else {
      return children;
    }
  } else {
    return children;
  }
}

const MarkdownRenderer = React.memo(MarkdownRendererComponent);

export default MarkdownRenderer;
