export const isValidId = (id: string): boolean => {
  const numId = Number(id);
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};
