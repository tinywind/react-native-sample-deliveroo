export default function debounce(timeoutId: number | undefined, func: (...args: any[]) => unknown, wait = 500) {
  if (timeoutId !== undefined) clearTimeout(timeoutId);
  return setTimeout(func, wait);
}
