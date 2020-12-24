export function getCurrentTime(): number {
  return Math.floor(new Date().valueOf() / 1000);
}
