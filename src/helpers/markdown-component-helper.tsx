import React from "react";

export const markdownComponents = {
  // Line Break
  br: () => <br />,

  // Links
  a: ({ children, ...props }) => (
    <a
      className="text-highlight-600 hover:underline dark:text-highlight-500"
      {...props}
    >
      {children}
    </a>
  ),

  // Headings
  h1: ({ children, ...props }) => (
    <h1
      className="mb-6 text-5xl font-extrabold text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-6 text-4xl font-bold text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-5 text-3xl font-bold text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="mb-3 text-xl font-semibold text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="mb-2 text-lg font-medium text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraph
  p: ({ children, ...props }) => (
    <p
      className="mb-4 break-words text-lg leading-relaxed text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </p>
  ),

  // Strong/Bold Text
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),

  // Emphasis/Italic Text
  em: ({ children, ...props }) => (
    <em className="italic text-gray-900 dark:text-white" {...props}>
      {children}
    </em>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul
      className="mb-4 list-inside list-disc space-y-2 text-lg text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-4 list-inside list-decimal space-y-2 text-lg text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="ml-6 break-words" {...props}>
      {children}
    </li>
  ),

  // Code Blocks and Inline Code
  code: ({ inline, className, children, ...props }) => {
    const language = className?.replace("language-", "") || "";
    return !inline ? (
      <pre
        className="my-4 overflow-x-auto rounded-md bg-gray-100 p-4 dark:bg-gray-800"
        {...props}
      >
        <code
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className={`${language ? `language-${language}` : ""} text-sm`}
          {...props}
        >
          {children}
        </code>
      </pre>
    ) : (
      <code
        className="rounded bg-gray-100 px-1 text-sm dark:bg-gray-800"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Images
  img: ({ alt, src, title }) => (
    <img alt={alt} src={src} title={title} className="my-4 h-auto max-w-full" />
  ),

  // Tables
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="min-w-full text-left text-lg text-gray-500 dark:text-gray-400"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="bg-gray-50 text-base uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b border-gray-200 dark:border-gray-700" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      scope="col"
      className="break-words px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="break-words px-4 py-2 align-top text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </td>
  ),
};

export function extractTextFromChildren(children: React.ReactNode): string {
  const lines: string[] = [];

  function recurse(children: React.ReactNode): void {
    React.Children.forEach(children, (child) => {
      if (typeof child === "string") {
        lines.push(child);
      } else if (React.isValidElement(child) && child.props.children) {
        recurse(child.props.children);
      }
    });
  }

  recurse(children);

  // Join the lines with line breaks, and trim each line
  return lines.map((line) => line.trim()).join("\n");
}
