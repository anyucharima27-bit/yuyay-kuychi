// ✏️ PERSONALIZA: ruta del audio (opcional), p. ej. "assets/musica.mp3".
// Déjala vacía si no hay música: así el botón no aparece y no se pide un archivo inexistente.
const RUTA_MUSICA = "";

const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

/* 1. Corazones y flores flotantes (pocos y suaves) */
if (!reducirMovimiento) {
  const simbolos = ["♥", "✿", "✦", "❀"];
  const colores = ["#e3b5c0", "#c9b8e3", "#a9c2a4", "#b8d0e6"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("span");
    el.className = "flotante";
    el.textContent = simbolos[i % simbolos.length];
    el.style.left = Math.random() * 100 + "%";
    el.style.fontSize = 14 + Math.random() * 16 + "px";
    el.style.color = colores[i % colores.length];
    el.style.animationDuration = 12 + Math.random() * 10 + "s";
    el.style.animationDelay = Math.random() * 12 + "s";
    $("flotantes").appendChild(el);
  }
}

/* 2. Abrir la carta */
$("btnAbrir").addEventListener("click", () => {
  $("portada").classList.add("salida");
  setTimeout(() => {
    $("portada").hidden = true;
    $("carta").hidden = false;
    window.scrollTo(0, 0);
    $("titulo-carta").focus({ preventScroll: true });
  }, reducirMovimiento ? 0 : 500);
});

/* 3. Sorpresa final con lluvia de pétalos */
$("btnSorpresa").addEventListener("click", () => {
  const boton = $("btnSorpresa");
  $("sorpresa").hidden = false;
  boton.disabled = true;
  boton.textContent = "Con cariño ♥";
  boton.setAttribute("aria-expanded", "true");
  $("sorpresa").scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "center" });

  if (reducirMovimiento) return;
  const colores = ["#e3b5c0", "#c9b8e3", "#b8d0e6", "#a9c2a4"];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("span");
    p.className = "petalo";
    p.textContent = i % 3 === 0 ? "♥" : "❀";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = "-20px";
    p.style.color = colores[i % colores.length];
    p.style.fontSize = 16 + Math.random() * 14 + "px";
    p.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
    p.style.animationDuration = 3 + Math.random() * 2.5 + "s";
    p.style.animationDelay = Math.random() * 0.8 + "s";
    $("lluvia").appendChild(p);
    setTimeout(() => p.remove(), 7000);
  }
});

/* 4. Música opcional: el botón aparece solo si el audio existe */
const audio = new Audio();
audio.loop = true;
audio.preload = "metadata";
audio.addEventListener("loadedmetadata", () => { $("btnMusica").hidden = false; });
if (RUTA_MUSICA) audio.src = RUTA_MUSICA;

$("btnMusica").addEventListener("click", () => {
  const boton = $("btnMusica");
  if (audio.paused) {
    audio.play().then(() => {
      boton.textContent = "❚❚ Pausar música";
      boton.setAttribute("aria-pressed", "true");
    }).catch(() => {});   // si el navegador la bloquea, no pasa nada
  } else {
    audio.pause();
    boton.textContent = "♪ Reproducir música";
    boton.setAttribute("aria-pressed", "false");
  }
});