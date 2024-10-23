/* eslint-disable @typescript-eslint/no-explicit-any */
// src/@types/jsx-parser.d.ts
import "react-jsx-parser";

declare module "react-jsx-parser" {
  interface JSXParserProps {
    components?: {
      [key: string]: React.ComponentType<{ any }>;
    };
  }
}
