// Normalize an email string: remove extra spaces + convert to lowercase.
// Useful before validating or sending to Firebase (since Firebase emails are case‑insensitive).
export function normalizeEmail(email) {
  return (email ?? "").trim().toLowerCase();
}



// Basic email validation using a simple regex.
// Returns true if the email format looks valid, otherwise false.
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



// Validate password rules.
// Returns an error message string OR null if password is valid.
export function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}



// Validate assignment title used in the Add Assignment form.
// Returns an error message OR null if valid.
export function validateAssignmentTitle(title) {
  const t = (title ?? "").trim();

  if (!t) return "Title is required.";
  if (t.length < 2) return "Title is too short.";
  if (t.length > 60) return "Title is too long (max 60 characters).";

  return null;
}



// Allowed priority values for the app (used in dropdowns and validation).
export const PRIORITIES = ["Low", "Medium", "High"];



// Normalize a priority string to one of the valid PRIORITIES.
// Converts input to lowercase and maps it to a clean display value.
export function normalizePriority(priority) {
  const p = (priority ?? "").trim().toLowerCase();

  const map = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return map[p] ?? null; // Returns null if input is invalid.
}



// Validates a due date in YYYY-MM-DD format.
// Ensures format correctness, valid calendar date, and that the date is not in the past.
// Returns an error message OR null if the date is valid.
export function validateDueDateYYYYMMDD(dueDateStr) {
  const s = (dueDateStr ?? "").trim();

  if (!s) return "Due date is required.";

  // Must match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "Due date must be in YYYY-MM-DD format.";

  const [y, m, d] = s.split("-").map((x) => Number(x));
  const dt = new Date(y, m - 1, d, 0, 0, 0, 0);

  // Invalid date (e.g., 2025-02-30)
  if (Number.isNaN(dt.getTime())) return "Due date is invalid.";

  // Compare with today (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dt < today) return "Due date cannot be in the past.";

  return null;
}
