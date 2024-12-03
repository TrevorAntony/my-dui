import React from "react";

export const markdownComponents = {
  a: ({ children, ...props }) => (
    <a className="text-blue-700 hover:underline dark:text-blue-500" {...props}>
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="text-default max-w-md list-inside list-disc space-y-1"
      {...props}
    >
      {children}
    </ul>
  ),
  h1: ({ children, ...props }) => (
    <h1
      className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mb-4 text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="mb-4 text-lg font-semibold leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="mb-4 text-base font-medium leading-tight tracking-tight text-gray-900 dark:text-white"
      {...props}
    >
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p className="text-default mb-4 text-base" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
      {children}
    </strong>
  ),
  thead: ({ children, ...props }) => (
    <thead
      className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </thead>
  ),
  table: ({ children, ...props }) => (
    <table
      className="w-full text-left text-sm text-gray-500 dark:text-gray-400"
      {...props}
    >
      {children}
    </table>
  ),
  th: ({ children, ...props }) => (
    <th
      className="bg-gray-50 px-6 py-3 text-xs font-medium uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
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
