export const formatDuration = (str: string): number => {
  return +str.split('M')[0].slice(2);
};
