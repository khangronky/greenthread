export function getDisplayNameFromEmail(email: string) {
  const emailName = email.split('@')[0];
  const displayName = emailName
    .split(/[._-]/)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return displayName;
}
