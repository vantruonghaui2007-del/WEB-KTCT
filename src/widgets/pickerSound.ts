export function createPickerSound(enabled: boolean) {
  let context: AudioContext | undefined;
  try {
    if (enabled && window.AudioContext) {
      context = new AudioContext();
      void context.resume().catch(() => {});
    }
  } catch {
    /* Audio is optional. */
  }
  const tone = (
    frequency: number,
    delay: number,
    duration: number,
    volume: number,
  ) => {
    if (!context || context.state === "closed") return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  };
  return {
    tick: () => tone(540, 0, 0.045, 0.035),
    win: () =>
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, i * 0.12, 0.55, 0.075),
      ),
    close: () => {
      if (context && context.state !== "closed")
        void context.close().catch(() => {});
    },
  };
}
