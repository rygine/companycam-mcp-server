/** Serialize a query value; arrays use Rails-style key[]=v repetition. */
export function appendQuery(
  params: URLSearchParams,
  key: string,
  value: unknown,
): void {
  if (value === undefined || value === null || value === "") return;
  if (Array.isArray(value)) {
    for (const v of value) params.append(`${key}[]`, String(v));
  } else {
    params.append(key, String(value));
  }
}
