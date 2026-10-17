export function quizView(step: number, n: number) {
  const last = n * 2;
  const s = Math.max(0, Math.min(last, step));
  return {
    index: Math.min(Math.floor(s / 2), n - 1),
    revealed: s % 2 === 1 || s === last,
    result: s === last,
  };
}
