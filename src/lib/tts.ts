export function speakJapanese(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const ja = voices.find((v) => v.lang.toLowerCase().startsWith("ja"));
  if (ja) u.voice = ja;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
