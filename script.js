
// Canvas setup
const canvas = document.getElementById('colorCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentColor = 'black';

canvas.addEventListener('mousedown', () => (isDrawing = true));
canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  checkCanvasCompletion();
});
canvas.addEventListener('mousemove', draw);

function draw(event) {
  if (!isDrawing) return;
  ctx.fillStyle = currentColor;
  ctx.beginPath();
  ctx.arc(event.offsetX, event.offsetY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function changeColor(color) {
  currentColor = color;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const imageUpload = document.getElementById('imageUpload');
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };
  reader.readAsDataURL(file);
});

function loadTracingTemplate(word) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'lightgray';
  ctx.fillText(word, canvas.width / 2, canvas.height / 2);
}

// Confetti logic
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#ff0', '#0f0', '#00f', '#f0f', '#f00', '#0ff']
  });
}

function playApplause() {
  const audio = new Audio('applause.mp3');
  audio.play();
}

function triggerConfettiWithSound() {
  triggerConfetti(); // Trigger confetti
  playApplause();    // Play sound
}

// Automatic celebration after coloring 50% of the canvas
function checkCanvasCompletion() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let coloredPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] !== 255 || pixels[i + 1] !== 255 || pixels[i + 2] !== 255) {
      coloredPixels++; // Count non-white pixels
    }
  }

  // If 50% of the canvas is colored, celebrate!
  if (coloredPixels > pixels.length / 8) {
    triggerConfettiWithSound();
  }
}
