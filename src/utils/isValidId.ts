export const isValidId = (id: string): boolean => {
  if (!id) return false;
  const numId = Number(id);
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};
