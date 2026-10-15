export function quizView(step: number, n: number) {
  const s = Math.max(0, Math.min(n * 2 - 1, step));
  return { index: Math.floor(s / 2), revealed: s % 2 === 1 };
}
