export function mapToCamelCase<T>(obj: unknown): T {
    const record = obj as Record<string, unknown>
    const result: Record<string, unknown> = {}

    for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
            const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
                letter.toUpperCase()
            )
            result[camelKey] = record[key]
        }
    }
    return result as T
}

export function mapArrayToCamelCase<T>(arr: unknown[]): T[] {
    return arr.map((item) => mapToCamelCase<T>(item))
}

export function mapToSnakeCase(obj: unknown): Record<string, unknown> {
    const record = obj as Record<string, unknown>
    const result: Record<string, unknown> = {}

    for (const key in record) {
        if (Object.prototype.hasOwnProperty.call(record, key)) {
            const snakeKey = key.replace(
                /[A-Z]/g,
                (letter) => `_${letter.toLowerCase()}`
            )
            result[snakeKey] = record[key]
        }
    }
    return result
}
