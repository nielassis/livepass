export function parseDate(dateString: string): string | null {
  const [day, month, year] = dateString.split('/').map(Number);

  if (!day || !month || !year) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date.toISOString();
}
