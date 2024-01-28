const dateFormat = new Intl.DateTimeFormat('ru', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

export function formatDate(dateSource: string | Date) {
  const date = new Date(dateSource);
  return dateFormat.format(date).replace('г.', '');
}

export function dateToISO(dateSource: string | Date) {
  const date = new Date(dateSource);
  return date.toISOString();
}

export function getDatesDiff(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.abs(d2.getTime() - d1.getTime());
}