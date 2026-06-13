export function mapToCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
      result[camelKey] = obj[key];
    }
  }
  return result as T;
}

export function mapArrayToCamelCase<T>(arr: Record<string, unknown>[]): T[] {
  return arr.map((item) => mapToCamelCase<T>(item));
}

export function mapToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = obj[key];
    }
  }
  return result;
}
