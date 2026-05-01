export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const isOverdue = (timestamp?: number): boolean => {
  if (!timestamp) return false;
  // Set to end of day to not show overdue if it's due today
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return timestamp < endOfToday.getTime();
};

export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
