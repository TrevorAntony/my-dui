export function deepCopy<T>(obj: T): T {
  if (!obj) return {} as T;
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge<T extends Record<string, unknown>, U extends object>(
  target: T,
  source: U,
): T & U {
  for (const key in source) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object
    ) {
      Object.assign(
        source[key],
        deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>,
        ),
      );
    }
  }
  Object.assign(target || {}, source);
  return target as T & U;
}
export interface DataItem {
  [key: string]: unknown;
}

export function transposeData(
  data: DataItem[] | undefined | null,
): { column: string; value: unknown[] }[] {
  if (!data || data.length === 0) return [];

  const headers = Object.keys(data[0] as DataItem);
  return headers.map((header) => ({
    column: header,
    value: data.map((item) => item[header]),
  }));
}

export const processQuery = (
  query: string,
  config: Record<string, string>,
): string => {
  return query.replace(/\{([^{}]+)\}/g, (match, placeholder) => {
    return config[placeholder] || match;
  });
};
