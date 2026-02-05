import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000";

export default function App() {
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [rank, setRank] = useState("");


  async function fetchArtists() {
    const res = await fetch(`${API}/api/artists`);
    const data = await res.json();
    setArtists(data);
  }

  useEffect(() => {
    fetchArtists();
  }, []);


  async function addArtist(e) {
    e.preventDefault();

    await fetch(`${API}/api/artists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        note: Number(note),
        rank: rank === "" ? 0 : Number(rank),
      }),
    });

    setName("");
    setNote("");
    setRank("");
    fetchArtists();
  }


  async function deleteArtist(id) {
    await fetch(`${API}/api/artists/${id}`, { method: "DELETE" });
    fetchArtists();
  }


  async function updateNote(id, currentNote) {
    const v = prompt("Nouvelle note (1-10) ?", currentNote);
    if (v === null) return;

    await fetch(`${API}/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: Number(v) }),
    });

    fetchArtists();
  }


  async function updateRank(id, currentRank) {
    const v = prompt("Nouveau rank (0-10) ? (0 = non classé)", currentRank ?? 0);
    if (v === null) return;

    await fetch(`${API}/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rank: Number(v) }),
    });

    fetchArtists();
  }

  return (
    <div className="app">
      <h1>🎵 My Top Artists</h1>
      <p>Ajoute tes artists favoris juste ici ⬇️</p>

      <form className="form" onSubmit={addArtist}>
        <input
          placeholder="Nom de l'artiste (ex: Davido)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Note (1-10)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          max="10"
          placeholder="Rank (0-10)"
          value={rank}
          onChange={(e) => setRank(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      <p className="hint">
        💡 Voilà les meilleurs artists d'afrobeats entre (2025-2026).
      </p>

      <ul className="list">
        {artists.map((a) => (
          <li key={a.id} className="row">
            <span>
              <b>{a.rank === 0 ? "—" : `#${a.rank}`}</b> {" "}
              <b>{a.name}</b> — note: {a.note}
            </span>

            <div className="actions">
              <button onClick={() => updateRank(a.id, a.rank)}>Rank</button>
              <button onClick={() => updateNote(a.id, a.note)}>Note</button>
              <button className="danger" onClick={() => deleteArtist(a.id)}>
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
