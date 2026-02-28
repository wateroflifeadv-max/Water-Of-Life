// songs.js
// PONÉ ACÁ TODAS TUS ALABANZAS (una por objeto)

window.SONGS = [
  {
    id: "alaba",
    category: "Alabanzas",
    title: "Alaba",
    key: "G",
    bpm: 127,
    driveId: "https://www.dropbox.com/scl/fi/g4q7mshvt7zhlkd9xhfp9/Alaba-Multitrack-Evan-Craft-MP3_160K.mp3?rlkey=1gnsfm94p43wggqqlzgkslxkr&st=oukgh3ez&dl=0",
    sections: [
      {
        name: "Refrán",
        lines: [
          // FORMATO: [{c:"ACORDE", t:"texto"}, {c:"", t:"texto"}]
          [{ c: "Em", t: "Acá va tu letra..." }],
          [{ c: "C", t: "Acá va tu letra..." }],
        ],
      },
      {
        name: "Verso 1",
        lines: [
          [{ c: "G", t: "Acá va tu letra..." }],
          [{ c: "Am", t: "Acá va tu letra..." }],
        ],
      },
    ],
  },

  {
    id: "grande-y-fuerte",
    category: "Alabanzas",
    title: "Grande y Fuerte",
    key: "G",
    bpm: 132,
    driveId: "PEGAR_ID_DE_DRIVE_AQUI",
    sections: [
      { name: "Verso 1", lines: [[{ c: "G", t: "Acá va tu letra..." }]] },
    ],
  },

  // ✅ Seguís agregando más canciones acá abajo...
];
