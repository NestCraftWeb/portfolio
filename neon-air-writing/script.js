const vid = document.getElementById('vid');
const c = document.getElementById('c');
const ctx = c.getContext('2d');

// UI Elements
const toggleBtn = document.getElementById('toggle-draw');
const clearBtn = document.getElementById('clear-canvas');
const drawStatusText = document.getElementById('draw-status');
const loadingIndicator = document.getElementById('loading-indicator');

// Drawing State
let arr = []; // Array of strokes
let cur = []; // Current stroke
let shiftPressed = false; // PC Shift key
let mobileDrawEnabled = false; // Mobile Toggle
let isDrawing = false;
let sx = null;
let sy = null;

// Theming
const NEON_COLOR = '#00ffff';
const NEON_GLOW = 'rgba(0, 255, 255, 0.4)';

// --- Event Listeners ---

// PC Keyboard
window.addEventListener('keydown', (e) => {
  if (e.key === 'Shift') shiftPressed = true;
  if (e.code === 'Space') clearCanvas();
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') shiftPressed = false;
});

// Mobile/UI Buttons
toggleBtn.addEventListener('click', () => {
  mobileDrawEnabled = !mobileDrawEnabled;
  if (mobileDrawEnabled) {
    toggleBtn.classList.add('active');
    drawStatusText.textContent = 'Draw (On)';
  } else {
    toggleBtn.classList.remove('active');
    drawStatusText.textContent = 'Draw (Off)';
  }
});

clearBtn.addEventListener('click', clearCanvas);

function clearCanvas() {
  arr = [];
  cur = [];
  sx = null;
  sy = null;
}

// Check if currently drawing (either shift pressed on PC or toggle active on Mobile)
function shouldDraw() {
  return shiftPressed || mobileDrawEnabled;
}

// --- MediaPipe Logic ---

function run(res) {
  // Hide loading text on first successful frame
  if (loadingIndicator && loadingIndicator.style.display !== 'none') {
    loadingIndicator.style.display = 'none';
  }

  // Handle Resize securely
  if (c.width !== window.innerWidth || c.height !== window.innerHeight) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  // Draw Camera Feed
  ctx.save();
  // Clear canvas
  ctx.clearRect(0, 0, c.width, c.height);
  
  // Need to mirror the image horizontally since the canvas is mirrored in CSS
  // actually, drawing it normally on a mirrored canvas will make it un-mirrored, so we draw it normally.
  ctx.drawImage(res.image, 0, 0, c.width, c.height);
  
  // Apply dark overlay
  ctx.fillStyle = 'rgba(5, 3, 1, 0.85)';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.restore();

  // Setup Neon Style for lines
  ctx.shadowColor = NEON_COLOR;
  ctx.shadowBlur = 15;
  ctx.strokeStyle = NEON_COLOR;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw previous strokes
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length === 0) continue;
    ctx.beginPath();
    ctx.moveTo(arr[i][0].x, arr[i][0].y);
    for (let j = 1; j < arr[i].length; j++) {
      ctx.lineTo(arr[i][j].x, arr[i][j].y);
    }
    ctx.stroke();
  }

  // Process Hand Landmarks
  if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) {
    const lm = res.multiHandLandmarks[0];
    
    // Draw Hand Skeleton (Subtle)
    drawConnectors(ctx, lm, HAND_CONNECTIONS, {color: 'rgba(0, 255, 255, 0.1)', lineWidth: 2});
    drawLandmarks(ctx, lm, {color: 'rgba(255, 255, 255, 0.5)', lineWidth: 1, radius: 2});

    // Get Index Finger Tip (Landmark 8)
    const ind = lm[8];
    // Convert normalized coordinates to canvas coordinates
    // Important: X is flipped because canvas is flipped
    const rx = (1 - ind.x) * c.width; 
    const ry = ind.y * c.height;

    // Smooth movement
    if (sx === null) {
      sx = rx; 
      sy = ry;
    } else {
      sx += (rx - sx) * 0.45;
      sy += (ry - sy) * 0.45;
    }

    // Draw Tracker Point
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, 2 * Math.PI);
    
    const drawing = shouldDraw();
    
    if (drawing) { 
      ctx.fillStyle = '#FFFFFF'; 
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 20;
    } else { 
      ctx.fillStyle = NEON_GLOW; 
      ctx.shadowBlur = 10;
    }
    ctx.fill();

    // Line drawing logic
    if (drawing) {
      if (!isDrawing) {
        isDrawing = true;
        cur = []; // Start a new stroke
        arr.push(cur);
      }
      cur.push({x: sx, y: sy}); // Add point to current stroke
    } else {
      isDrawing = false;
    }
  } else {
    isDrawing = false;
    sx = null;
  }
}

// --- Initialization ---

const h = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});

h.setOptions({ 
  maxNumHands: 1, 
  modelComplexity: 1, // Balance performance and accuracy
  minDetectionConfidence: 0.5, 
  minTrackingConfidence: 0.5 
});

h.onResults(run);

// Setup Camera
const cam = new Camera(vid, {
  onFrame: async () => { 
    await h.send({image: vid}); 
  },
  width: { ideal: 1280 }, // Using ideal constraints allows better fallback on mobile
  height: { ideal: 720 },
  facingMode: 'user' // Ask for front camera on mobile
});

// Add a fallback in case Camera creation fails on some mobile browsers
try {
  cam.start();
} catch (e) {
  console.error("Camera failed to start automatically", e);
  loadingIndicator.textContent = "Please allow camera access";
}
