/* =========================================================
   PERSONALIZE THE WEBSITE HERE
   Change these three values, save, and refresh the page.
   ========================================================= */
const birthdayConfig = {
  girlfriendName: "My Baby",
  fromName: "Your Boyfriend",
  birthdayLabel: "Your special day"
};

document.querySelectorAll("[data-girlfriend-name]").forEach((element) => {
  element.textContent = birthdayConfig.girlfriendName;
});
document.querySelectorAll("[data-from-name]").forEach((element) => {
  element.textContent = birthdayConfig.fromName;
});
document.querySelectorAll("[data-birthday-label]").forEach((element) => {
  element.textContent = birthdayConfig.birthdayLabel;
});
document.title = `Happy Birthday, ${birthdayConfig.girlfriendName}!`;

// Reveal sections as they enter the screen.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  revealObserver.observe(element);
});

// Interactive reason cards.
const reasons = [
  "You make every room feel warmer just by being in it.",
  "Your laugh can rescue even the most ordinary day.",
  "You care deeply, love bravely, and never pretend to be anyone else.",
  "Somehow, you make both adventures and quiet moments feel magical.",
  "With you, I never have to wonder what home feels like."
];
let reasonIndex = 0;
const reasonText = document.getElementById("reasonText");
const reasonNumber = document.getElementById("reasonNumber");
const reasonCard = document.querySelector(".reason-card-main");
const reasonDots = document.getElementById("reasonDots");

reasons.forEach((_, index) => {
  const dot = document.createElement("span");
  dot.classList.toggle("active", index === 0);
  reasonDots.appendChild(dot);
});

document.getElementById("nextReason").addEventListener("click", () => {
  reasonCard.classList.add("changing");
  setTimeout(() => {
    reasonIndex = (reasonIndex + 1) % reasons.length;
    reasonNumber.textContent = `Reason no. ${String(reasonIndex + 1).padStart(2, "0")}`;
    reasonText.textContent = reasons[reasonIndex];
    [...reasonDots.children].forEach((dot, index) => dot.classList.toggle("active", index === reasonIndex));
    reasonCard.classList.remove("changing");
  }, 260);
});

// Open and close the love letter.
const loveLetter = document.getElementById("loveLetter");
const openLetterButton = document.getElementById("openLetter");
const closeLetterButton = document.getElementById("closeLetter");

function setLetter(open) {
  loveLetter.classList.toggle("open", open);
  loveLetter.setAttribute("aria-hidden", String(!open));
  openLetterButton.setAttribute("aria-expanded", String(open));
  if (open) closeLetterButton.focus();
}
openLetterButton.addEventListener("click", () => setLetter(true));
closeLetterButton.addEventListener("click", () => setLetter(false));

// Surprise modal.
const modal = document.getElementById("surpriseModal");
const modalClose = document.getElementById("modalClose");
function setModal(open) {
  modal.classList.toggle("show", open);
  modal.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) modalClose.focus();
}
document.getElementById("celebrateButton").addEventListener("click", () => {
  setModal(true);
  launchConfetti(170);
});
modalClose.addEventListener("click", () => setModal(false));
modal.addEventListener("click", (event) => { if (event.target === modal) setModal(false); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { setModal(false); setLetter(false); }
});
document.getElementById("modalConfetti").addEventListener("click", () => launchConfetti(260));
document.getElementById("wishButton").addEventListener("click", (event) => {
  launchConfetti(320);
  event.currentTarget.innerHTML = "Wish sent";
});

// Lightweight canvas confetti, with no third-party library.
const canvas = document.getElementById("confetti");
const context = canvas.getContext("2d");
let pieces = [];
let animationFrame;
const confettiColors = ["#245c4a", "#a8d5ad", "#d9f28f", "#ffb7a5", "#fffdf4"];

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  context.setTransform(scale, 0, 0, scale, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti(amount = 180) {
  const originX = window.innerWidth / 2;
  const originY = window.innerHeight * .5;
  pieces.push(...Array.from({ length: amount }, () => ({
    x: originX + (Math.random() - .5) * 120,
    y: originY + (Math.random() - .5) * 40,
    vx: (Math.random() - .5) * 13,
    vy: -Math.random() * 12 - 4,
    gravity: .18 + Math.random() * .08,
    drag: .992,
    size: 5 + Math.random() * 7,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - .5) * .25,
    life: 170 + Math.random() * 70
  })));
  cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces = pieces.filter((piece) => piece.life > 0 && piece.y < window.innerHeight + 30);
  pieces.forEach((piece) => {
    piece.vx *= piece.drag;
    piece.vy += piece.gravity;
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.rotation += piece.spin;
    piece.life -= 1;
    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * .65);
    context.restore();
  });
  if (pieces.length) animationFrame = requestAnimationFrame(animateConfetti);
  else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

// A short, original celebratory melody using the browser's Web Audio API.
const soundButton = document.getElementById("soundButton");
let audioContext;
let melodyTimer;
let melodyPlaying = false;
const notes = [523.25, 659.25, 783.99, 659.25, 698.46, 880, 783.99, 659.25, 587.33, 659.25, 523.25];

function playNote(frequency, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(.11, startTime + .03);
  gain.gain.exponentialRampToValueAtTime(.001, startTime + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

soundButton.addEventListener("click", () => {
  if (melodyPlaying) return;
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  const start = audioContext.currentTime + .08;
  notes.forEach((note, index) => playNote(note, start + index * .24, .36));
  melodyPlaying = true;
  soundButton.classList.add("playing");
  soundButton.setAttribute("aria-pressed", "true");
  soundButton.querySelector(".sound-label").textContent = "Playing...";
  clearTimeout(melodyTimer);
  melodyTimer = setTimeout(() => {
    melodyPlaying = false;
    soundButton.classList.remove("playing");
    soundButton.setAttribute("aria-pressed", "false");
    soundButton.querySelector(".sound-label").textContent = "Play song";
  }, notes.length * 240 + 600);
});
