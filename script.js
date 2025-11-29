// Elements
const starCanvas = document.getElementById("star-canvas");
const ctx = starCanvas.getContext("2d");
const startJourneyBtn = document.getElementById("start-journey");
const typewriterEl = document.getElementById("typewriter-text");
const musicToggle = document.getElementById("music-toggle");
const musicIndicator = document.querySelector(".music-indicator");
const bgMusic = document.getElementById("bg-music");
const constellationStars = document.querySelectorAll(".constellation-star");

let isMusicPlaying = false;

/* ========== STARFIELD ========== */
function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];
const STAR_COUNT = 160;

function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 1.6 + 0.3,
            alpha: Math.random(),
            twinkleSpeed: 0.005 + Math.random() * 0.02
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (const star of stars) {
        star.alpha += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${star.alpha})`;
        ctx.fill();
    }
    requestAnimationFrame(drawStars);
}

createStars();
drawStars();

/* ========== SHOOTING STARS (occasionally) ========== */
function spawnShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    const startX = window.innerWidth * (0.6 + Math.random() * 0.3);
    const startY = window.innerHeight * (Math.random() * 0.2);
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 900 + 200);
}

setInterval(() => {
    if (Math.random() < 0.4) spawnShootingStar();
}, 5000);

/* ========== TYPEWRITER ========== */
function startTypewriter() {
    const fullText = typewriterEl.getAttribute("data-full-text");
    typewriterEl.textContent = "";
    let idx = 0;

    function typeChar() {
        if (idx <= fullText.length) {
            typewriterEl.textContent = fullText.slice(0, idx);
            idx++;
            const char = fullText[idx - 1];
            const delay = (char === "." || char === "!" || char === "?") ? 90 : 40;
            setTimeout(typeChar, delay);
        }
    }
    typeChar();
}

/* ========== HERO BUTTON SCROLL + TYPEWRITER TRIGGER ========== */
if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", () => {
        const messageSection = document.getElementById("message");
        messageSection.scrollIntoView({ behavior: "smooth", block: "start" });
        // slight delay so it starts as she reaches the section
        setTimeout(startTypewriter, 700);
    });
}

/* ========== MUSIC CONTROL ========== */
musicToggle.addEventListener("click", async () => {
    try {
        if (!isMusicPlaying) {
            await bgMusic.play();
            isMusicPlaying = true;
            musicToggle.textContent = "Pause Music ⏸️";
            musicToggle.classList.remove("paused");
            musicIndicator.classList.add("playing");
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.textContent = "Play Music 🎵";
            musicToggle.classList.add("paused");
            musicIndicator.classList.remove("playing");
        }
    } catch (err) {
        console.error("Music play error:", err);
    }
});
// Start as paused style
musicToggle.classList.add("paused");

/* ========== CONSTELLATION BUTTONS ========== */
constellationStars.forEach(btn => {
    btn.addEventListener("click", () => {
        const word = btn.getAttribute("data-word");
        const wordSpan = btn.querySelector(".word");
        wordSpan.textContent = word;
        btn.classList.add("revealed");

        // small ripple/tap effect at button center
        const rect = btn.getBoundingClientRect();
        spawnTapEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

/* ========== TAP EFFECT (STARS + FLOWERS) ========== */
function spawnTapEffect(x, y) {
    const tap = document.createElement("div");
    tap.className = "tap-effect";
    tap.style.left = `${x}px`;
    tap.style.top = `${y}px`;
    document.body.appendChild(tap);
    setTimeout(() => tap.remove(), 800);
}

// On any tap/click on background, spawn effect
document.addEventListener("click", (e) => {
    // Avoid triggering on buttons/controls only
    const target = e.target;
    if (
        target.closest("button") ||
        target.closest(".card") ||
        target.closest(".constellation-grid")
    ) {
        return;
    }
    spawnTapEffect(e.clientX, e.clientY);
});
