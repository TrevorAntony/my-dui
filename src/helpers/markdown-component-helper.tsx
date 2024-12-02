import React from "react";

export const markdownComponents = {
  // Links
  a: ({ children, ...props }) => (
    <a className="text-blue-600 hover:underline dark:text-blue-500" {...props}>
      {children}
    </a>
  ),

  // Headings
  h1: ({ children, ...props }) => (
    <h1
      className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-4xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-4 text-xl font-bold text-gray-900 dark:text-white md:text-2xl"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mb-4 text-lg font-semibold text-gray-900 dark:text-white md:text-xl"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="mb-4 text-base font-semibold text-gray-900 dark:text-white md:text-lg"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="mb-4 text-sm font-medium text-gray-900 dark:text-white md:text-base"
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p
      className="mb-4 break-words text-base text-gray-700 dark:text-gray-300 md:text-lg"
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
      className="mb-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-4 list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="break-words" {...props}>
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
    <div className="my-4 overflow-x-auto">
      <table
        className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
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
      className="break-words px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="break-words px-4 py-2 text-gray-900 dark:text-white"
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
