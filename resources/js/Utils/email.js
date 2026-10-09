/**
 * Helper to check whether a given email is still a placeholder (e.g. "[EMAIL_PERUSAHAAN]").
 * Returns true if empty, not a string, or starts with "[".
 */
export function isPlaceholderEmail(email) {
  if (!email || typeof email !== 'string') return true;
  return email.trim().startsWith('[');
}
