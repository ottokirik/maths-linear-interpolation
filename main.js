import "./style.css";

/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Точки
const A = { x: 100, y: 300 };
const B = { x: 400, y: 100 };

// Цвета
const orange = { r: 230, g: 150, b: 0 };
const blue = { r: 0, g: 70, b: 160 };

// Звук
const lowFrequency = 200;
const highFrequency = 600;

let audioCtx = null;
let osc = null;

canvas.addEventListener("click", () => {
  if (audioCtx === null) {
    audioCtx = new (AudioContext || webkitAudioContext)();
    osc = audioCtx.createOscillator();
    osc.frequency.value = 200;
    osc.start();

    const node = audioCtx.createGain();
    node.gain.value = 0.1;

    osc.connect(node);
    node.connect(audioCtx.destination);
  }
});

animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const sec = Date.now() / 1000;
  const t = (Math.sin(sec * 2) + 1) / 2;

  const C = vectorLinearInterpolation(A, B, t);
  drawDot(C, "");

  drawDot(A, "A");
  drawDot(B, "B");

  const { r, g, b } = vectorLinearInterpolation(orange, blue, t);
  canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  if (osc) {
    osc.frequency.value = linearInterpolation(lowFrequency, highFrequency, t);
  }

  ctx.save();
  ctx.strokeStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 40px sans-serif";
  ctx.setLineDash([linearInterpolation(3, 130, t), 100]);
  ctx.strokeText("click for sound", canvas.width / 2, 20);
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillText("click for sound", canvas.width / 2, 20);
  ctx.restore();

  requestAnimationFrame(animate);
}

function vectorLinearInterpolation(A, B, t) {
  const res = {};

  for (const key in A) {
    res[key] = linearInterpolation(A[key], B[key], t);
  }

  return res;
}

function linearInterpolation(a, b, t) {
  return a + (b - a) * t;
}

function drawDot(pos, label = "") {
  ctx.beginPath();

  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(label, pos.x, pos.y);
}
