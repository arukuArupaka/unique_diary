export const getTodayString = (): string => {
  const now = new Date();
  now.setHours(now.getHours() + 9); // JST補正
  return now.toISOString().split("T")[0];
};

export const isValidDateString = (dateString: string): boolean => {
  if (!dateString) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
