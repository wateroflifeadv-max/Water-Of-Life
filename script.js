// WATER OF LIFE - Script base

document.addEventListener("DOMContentLoaded", function() {
  console.log("WATER OF LIFE cargado correctamente");

  // Efecto simple al hacer clic en navegación
  const links = document.querySelectorAll("nav a");

  links.forEach(link => {
    link.addEventListener("click", function() {
      console.log("Navegando a:", this.getAttribute("href"));
    });
  });
});
const $ = (id) => document.getElementById(id);

const catalogView = $("catalogView");
const songView = $("songView");
const catalogList = $("catalogList");
const search = $("search");

const songTitle = $("songTitle");
const songKey = $("songKey");
const songBpm = $("songBpm");

const backBtn = $("backBtn");
const toggleLyrics = $("toggleLyrics");
const lyricsPanel = $("lyricsPanel");
const lyricsContainer = $("lyricsContainer");
const accIcon = $("accIcon");

const audio = $("audio");
const playBtn = $("playBtn");
const seek = $("seek");
const timeEl = $("time");
const driveOpen = $("driveOpen");

const upBtn = $("upBtn");
const downBtn = $("downBtn");
const resetBtn = $("resetBtn");

let currentSong = null;
let transposeSteps = 0;

// ---- helpers chords ----
const NOTES_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT_TO_SHARP = { "Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#" };

function normalizeChordRoot(root){
  if(FLAT_TO_SHARP[root]) return FLAT_TO_SHARP[root];
  return root;
}

function transposeChord(chord, steps){
  // soporta: G, Gm, G7, G/B, etc
  // transponemos solo la raíz y la raíz del bajo (slash chord)
  if(!chord || chord.trim()==="") return chord;

  const parts = chord.split("/");
  const main = parts[0];
  const bass = parts[1] || null;

  const tMain = transposeOne(main, steps);
  const tBass = bass ? transposeOne(bass, steps) : null;

  return tBass ? `${tMain}/${tBass}` : tMain;
}

function transposeOne(ch, steps){
  const m = ch.match(/^([A-G])(#|b)?(.*)$/);
  if(!m) return ch;

  let root = m[1] + (m[2] || "");
  const rest = m[3] || "";

  root = normalizeChordRoot(root);

  let idx = NOTES_SHARP.indexOf(root);
  if(idx === -1) return ch;

  let n = (idx + steps) % 12;
  if(n < 0) n += 12;

  return NOTES_SHARP[n] + rest;
}

// ---- Drive audio ----
function driveAudioUrl(fileId){
  // suele funcionar si el archivo está público “Cualquiera con el enlace”
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}
function driveOpenUrl(fileId){
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// ---- UI ----
function showCatalog(){
  catalogView.classList.remove("hidden");
  songView.classList.add("hidden");
  currentSong = null;
  transposeSteps = 0;
  stopAudio();
}

function showSong(song){
  currentSong = song;
  transposeSteps = 0;

  catalogView.classList.add("hidden");
  songView.classList.remove("hidden");

  songTitle.textContent = song.title;
  songKey.textContent = `Tono: ${song.key || "—"}`;
  songBpm.textContent = `BPM: ${song.bpm || "—"}`;

  // cargar audio drive
  if(song.driveId && song.driveId !== "PEGAR_ID_DE_DRIVE_AQUI"){
    audio.src = driveAudioUrl(song.driveId);
    driveOpen.href = driveOpenUrl(song.driveId);
    driveOpen.textContent = "🎧 Abrir multitrack en Drive";
  }else{
    audio.removeAttribute("src");
    driveOpen.href = "#";
    driveOpen.textContent = "📁 Falta ID de Drive";
  }

  // panel cerrado por defecto
  lyricsPanel.classList.add("hidden");
  accIcon.textContent = "▾";
  renderLyrics();
}

// Render “como tu imagen”: acordes arriba, letra abajo
function renderLyrics(){
  if(!currentSong) return;
  lyricsContainer.innerHTML = "";

  currentSong.sections.forEach(sec => {
    const secTitle = document.createElement("div");
    secTitle.className = "section-title";
    secTitle.textContent = sec.name || "";
    lyricsContainer.appendChild(secTitle);

    sec.lines.forEach(lineParts => {
      // armamos dos renglones: chords y text
      const chords = lineParts.map(p => transposeChord(p.c || "", transposeSteps)).join("   ");
      const text = lineParts.map(p => (p.t || "")).join(" ");

      const row = document.createElement("div");
      row.className = "line";

      const chordsEl = document.createElement("div");
      chordsEl.className = "chords";
      chordsEl.textContent = chords;

      const textEl = document.createElement("div");
      textEl.className = "text";
      textEl.textContent = text;

      row.appendChild(chordsEl);
      row.appendChild(textEl);
      lyricsContainer.appendChild(row);
    });
  });
}

// ---- audio controls ----
function fmtTime(s){
  if(!isFinite(s)) return "0:00";
  const m = Math.floor(s/60);
  const r = Math.floor(s%60);
  return `${m}:${String(r).padStart(2,"0")}`;
}

function stopAudio(){
  audio.pause();
  audio.currentTime = 0;
  playBtn.textContent = "▶";
}

playBtn.addEventListener("click", () => {
  if(!audio.src) return;
  if(audio.paused){
    audio.play().catch(()=>{});
    playBtn.textContent = "⏸";
  }else{
    audio.pause();
    playBtn.textContent = "▶";
  }
});

audio.addEventListener("loadedmetadata", () => {
  timeEl.textContent = `${fmtTime(0)} / ${fmtTime(audio.duration)}`;
});

audio.addEventListener("timeupdate", () => {
  if(!isFinite(audio.duration)) return;
  const p = (audio.currentTime / audio.duration) * 100;
  seek.value = String(p);
  timeEl.textContent = `${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration)}`;
});

seek.addEventListener("input", () => {
  if(!isFinite(audio.duration)) return;
  const t = (Number(seek.value)/100) * audio.duration;
  audio.currentTime = t;
});

// ---- accordion ----
toggleLyrics.addEventListener("click", () => {
  const isHidden = lyricsPanel.classList.toggle("hidden");
  accIcon.textContent = isHidden ? "▾" : "▴";
});

// ---- transpose ----
upBtn.addEventListener("click", () => {
  transposeSteps += 1;
  renderLyrics();
});
downBtn.addEventListener("click", () => {
  transposeSteps -= 1;
  renderLyrics();
});
resetBtn.addEventListener("click", () => {
  transposeSteps = 0;
  renderLyrics();
});

// ---- catalog ----
function buildCatalog(list){
  catalogList.innerHTML = "";

  list.forEach(song => {
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `
      <h3>${song.title}</h3>
      <div class="meta-row">
        <span class="chip">Tono: ${song.key || "—"}</span>
        <span class="chip">BPM: ${song.bpm || "—"}</span>
      </div>
    `;
    card.addEventListener("click", () => showSong(song));
    catalogList.appendChild(card);
  });
}

function filterSongs(q){
  q = (q || "").trim().toLowerCase();
  const all = (window.SONGS || []).filter(s => (s.category || "") === "Alabanzas");

  if(!q) return all;

  return all.filter(s => {
    const hay = `${s.title} ${s.key} ${s.bpm}`.toLowerCase();
    return hay.includes(q);
  });
}

search.addEventListener("input", () => buildCatalog(filterSongs(search.value)));

backBtn.addEventListener("click", showCatalog);

// init
buildCatalog(filterSongs(""));
showCatalog();
