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
