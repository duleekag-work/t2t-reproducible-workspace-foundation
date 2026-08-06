const MAX_NAME_LENGTH = 80;

/**
 * Validates untrusted request input at the system boundary.
 * Returns a trimmed name, or null if the input is unusable.
 */
export function normalizeName(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) return null;
  return trimmed;
}

const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

/** Accepts an item id only in the exact shape the database uses. */
export function parseItemId(value) {
  if (typeof value !== 'string') return null;
  return OBJECT_ID_PATTERN.test(value) ? value : null;
}
