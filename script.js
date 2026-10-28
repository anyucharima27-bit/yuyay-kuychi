// ✏️ PERSONALIZA: canción de YouTube. Es lo que va después de "watch?v=" en el enlace.
// Si la cambias, cambia también el nombre y el artista en index.html (id="cancion" e id="artista").
const VIDEO_YOUTUBE = "h_qaIfL9-UU";

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
  $("sorpresa").scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
  sonarCancion();

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

/* 4. Canción favorita con reproductor propio (ondas + barra de tiempo) */
let player = null;
let listo = false;
let quiereSonar = false;   // se tocó "sorpresa" antes de que YouTube terminara de cargar
let reloj = null;

const minutos = (s) => {
  s = Math.max(0, Math.floor(s || 0));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};

function pintarBarra(actual, total) {
  const pct = total ? (actual / total) * 100 : 0;
  $("barra").value = pct;
  $("barra").style.setProperty("--p", pct + "%");
  $("tActual").textContent = minutos(actual);
  if (total) $("tTotal").textContent = minutos(total);
}

function actualizar() {
  if (!listo) return;
  pintarBarra(player.getCurrentTime(), player.getDuration());
}

function sonarCancion() {
  if (listo) player.playVideo();
  else quiereSonar = true;
}

function avisar(texto) {
  $("avisoMusica").textContent = texto;
  $("avisoMusica").hidden = !texto;
}

// Carga la API de YouTube al abrir la página, para que esté lista cuando toquen la sorpresa
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("yt", {
    videoId: VIDEO_YOUTUBE,
    playerVars: { playsinline: 1, rel: 0, controls: 0, modestbranding: 1, disablekb: 1 },
    events: {
      onReady: () => {
        listo = true;
        $("btnPlay").disabled = false;
        $("barra").disabled = false;
        actualizar();
        if (quiereSonar) player.playVideo();
      },
      onStateChange: (e) => {
        const sonando = e.data === YT.PlayerState.PLAYING;
        $("reproductor").classList.toggle("sonando", sonando);
        $("btnPlay").setAttribute("aria-label", sonando ? "Pausar" : "Reproducir");
        clearInterval(reloj);
        if (sonando) {
          avisar("");
          reloj = setInterval(actualizar, 250);
        }
        if (e.data === YT.PlayerState.ENDED) { player.seekTo(0); player.playVideo(); }  // repetir
        actualizar();
      },
      onError: () => {
        avisar("No se pudo cargar la canción aquí. Puedes escucharla en YouTube.");
      }
    }
  });
};
const api = document.createElement("script");
api.src = "https://www.youtube.com/iframe_api";
api.onerror = () => avisar("No se pudo conectar con YouTube. Revisa tu conexión a internet.");
document.head.appendChild(api);

$("btnPlay").addEventListener("click", () => {
  if (!listo) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
});

$("barra").addEventListener("input", () => {
  if (!listo) return;
  const total = player.getDuration();
  const destino = ($("barra").value / 100) * total;
  pintarBarra(destino, total);
  player.seekTo(destino, true);
});