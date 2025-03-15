function getMoscowISODate(): string {
  const dt = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dt);
}

console.log(getMoscowISODate());
