export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.";

export function isStrongPassword(password = "") {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}
