export function deepCopy(obj) {
  if (!obj) return {};
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

export function transposeData(data) {
  if (!data || data.length === 0) return [];

  const headers = Object.keys(data[0]);
  return headers.map((header) => ({
    column: header,
    value: data.map((item) => item[header]),
  }));
}

export const processQuery = (
  query: string,
  config: { [key: string]: string }
) => {
  const processedQuery = query.replace(/\{(\w+)\}/g, (match, placeholder) => {
    return config[placeholder] || match;
  });
  return processedQuery;
};
