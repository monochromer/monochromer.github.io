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