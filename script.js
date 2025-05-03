
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

let audioContext, analyser, source, dataArray, bufferLength;
let animationId = null;

function setupAudio() {
  const audio = new Audio("https://cutters-choice-radio.radiocult.fm/stream");
  audio.crossOrigin = "anonymous";
  audio.play();

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  source = audioContext.createMediaElementSource(audio);
  analyser = audioContext.createAnalyser();

  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;

  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  animate();
}

function animate() {
  animationId = requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 1.2;
    ctx.fillStyle = "#5A8785";
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 0.5;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("waveform");
  canvas.width = canvas.offsetWidth;
  canvas.height = 150;

  const playerIframe = document.getElementById("inlinePlayer");

  playerIframe.addEventListener("load", () => {
    // Triggered when iframe loads — user can hit play button inside
    setupAudio();
  });
});
