import React from "react";
export const markdownComponents = {
  a: ({ children, ...props }) => (
    <a className="text-blue-600 underline" {...props}>
      {children}
    </a>
  ),
  ul: ({ children, ...props }) => (
    <ul className="ml-5 list-disc" {...props}>
      {children}
    </ul>
  ),
  table: ({ children, ...props }) => (
    <table className="min-w-full divide-y divide-gray-200" {...props}>
      {children}
    </table>
  ),
  th: ({ children, ...props }) => (
    <th
      className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="whitespace-nowrap px-6 py-4" {...props}>
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
