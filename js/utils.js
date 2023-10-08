import { ModelData } from "./modelData";
import { showInfo } from "./uicontroller/controller";
export function generateCUUID() {
  const crypto = window.crypto || window.msCrypto;

  if (crypto && crypto.getRandomValues) {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);

    // Set the version (4) and variant (8, 9, A, or B) bits
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // variant (bits 10xx)

    // Convert the buffer to a hex string
    const uuidArray = Array.from(buffer);
    const uuidHex = uuidArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Format the UUID string with dashes
    return (
      uuidHex.substring(0, 8) +
      "-" +
      uuidHex.substring(8, 12) +
      "-" +
      uuidHex.substring(12, 16) +
      "-" +
      uuidHex.substring(16, 20) +
      "-" +
      uuidHex.substring(20)
    );
  } else {
    const timestamp = Date.now().toString(16).slice(-12);
    const randomPart = Math.random().toString(16).slice(2, 14);
    return timestamp + randomPart;
  }
}

var timer = null;

export function createTypingEffect(element, text, isIntro) {
  if (isIntro) {
    element.innerHTML = text;
    return;
  }
  startInterval(element, text);
}
function startInterval(element, text) {
  let i = 0;
  timer = setInterval(function () {
    if (i < text.length) element.innerHTML += text[i++];
  }, 20);
}
export function stopInterval() {
  if (timer) clearInterval(timer);
}

let speech = new SpeechSynthesisUtterance();
let voices = window.speechSynthesis.getVoices();
export function textToVoice(text) {
  speech.text = text;
  speech.voice = voices[0];
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
  console.log(voices);
}

export function stopSpeech() {
  if (speech) window.speechSynthesis.cancel();
}

export function showIntro() {
  showInfo(ModelData.openingIntro, false, true);
}
