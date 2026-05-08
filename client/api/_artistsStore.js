let artists = [
  { id: 1, userId: 1, name: "Davido", note: 10, rank: 1 },
  { id: 2, userId: 1, name: "Burna Boy", note: 9, rank: 2 },
  { id: 3, userId: 1, name: "Kizz Daniel", note: 9, rank: 3 },
  { id: 4, userId: 1, name: "Aya Nakamura", note: 10, rank: 4 },
  { id: 5, userId: 1, name: "Maître Gims", note: 8, rank: 5 },
];

let nextId = 6;

function sortArtists(list) {
  return [...list].sort((a, b) => {
    if (a.rank === 0 && b.rank !== 0) return 1;
    if (b.rank === 0 && a.rank !== 0) return -1;
    return a.rank - b.rank;
  });
}

function rankTaken(rank, exceptId) {
  return artists.some((artist) => artist.rank === rank && artist.id !== exceptId);
}

export function getArtists() {
  return sortArtists(artists);
}

export function createArtist(payload) {
  let { name, note, rank } = payload;

  name = String(name || "").trim();
  note = Number(note);
  rank = rank === undefined || rank === "" ? 0 : Number(rank);

  if (!name) return { error: "name obligatoire", status: 400 };
  if (!Number.isFinite(note)) return { error: "note invalide", status: 400 };
  if (!Number.isFinite(rank)) return { error: "rank invalide", status: 400 };

  if (rank !== 0 && rankTaken(rank, null)) rank = 0;

  const artist = { id: nextId++, userId: 1, name, note, rank };
  artists.push(artist);

  return { artist, status: 201 };
}

export function updateArtist(id, payload) {
  const artist = artists.find((item) => item.id === id);
  if (!artist) return { error: "Artiste non trouvé", status: 404 };

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) return { error: "name invalide", status: 400 };
    artist.name = name;
  }

  if (payload.note !== undefined) {
    const note = Number(payload.note);
    if (!Number.isFinite(note)) return { error: "note invalide", status: 400 };
    artist.note = note;
  }

  if (payload.rank !== undefined) {
    let rank = Number(payload.rank);
    if (!Number.isFinite(rank)) return { error: "rank invalide", status: 400 };
    if (rank !== 0 && rankTaken(rank, id)) rank = 0;
    artist.rank = rank;
  }

  return { artist, status: 200 };
}

export function deleteArtist(id) {
  const index = artists.findIndex((artist) => artist.id === id);
  if (index === -1) return { error: "Artiste non trouvé", status: 404 };

  const [artist] = artists.splice(index, 1);
  return { artist, status: 200 };
}
