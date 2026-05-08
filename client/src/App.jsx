import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "/api/artists";

export default function App() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newRank, setNewRank] = useState("");
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erreur serveur");

      const data = await res.json();
      setArtists(data);
    } catch (e) {
      setError("Impossible de charger les artistes. Verifie que le serveur API tourne sur le port 3000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filteredArtists = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return artists;

    return artists.filter((artist) => artist.name.toLowerCase().includes(query));
  }, [artists, search]);

  const handleAdd = async (e) => {
    e.preventDefault();

    const name = newName.trim();
    const note = Number(newNote);
    const rank = newRank === "" ? 0 : Number(newRank);

    if (!name) {
      alert("Le nom est obligatoire.");
      return;
    }

    if (!Number.isFinite(note) || note < 1 || note > 10) {
      alert("La note doit etre un nombre entre 1 et 10.");
      return;
    }

    if (!Number.isFinite(rank) || rank < 0 || rank > 10) {
      alert("Le classement doit etre entre 0 et 10.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, note, rank }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Erreur lors de l'ajout.");
        return;
      }

      setNewName("");
      setNewNote("");
      setNewRank("");
      fetchArtists();
    } catch (e) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Erreur lors de la suppression.");
        return;
      }

      fetchArtists();
    } catch (e) {
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleUpdateNote = async (id, currentName, currentNote) => {
    const value = prompt(`Nouvelle note pour ${currentName} (1-10)`, currentNote);
    if (value === null) return;

    const note = Number(value);
    if (!Number.isFinite(note) || note < 1 || note > 10) {
      alert("Note invalide. Elle doit etre entre 1 et 10.");
      return;
    }

    await updateArtist(id, { note });
  };

  const handleUpdateRank = async (id, currentRank) => {
    const value = prompt("Nouveau classement (1-10, ou 0 pour aucun)", currentRank);
    if (value === null) return;

    const rank = Number(value);
    if (!Number.isFinite(rank) || rank < 0 || rank > 10) {
      alert("Classement invalide. Il doit etre entre 0 et 10.");
      return;
    }

    await updateArtist(id, { rank });
  };

  const updateArtist = async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Erreur lors de la modification.");
        return;
      }

      fetchArtists();
    } catch (e) {
      alert("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">♪</div>
          <div>
            <h1>Top Artists</h1>
            <p>Classement Afro</p>
          </div>
        </div>

        <div className="nav">
          <div className="navItem">
            <strong>Artistes</strong>
            <span className="badge">{artists.length}</span>
          </div>
          <div className="navItem">
            <strong>Top 10</strong>
            <span className="badge">{artists.filter((a) => a.rank > 0).length}</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="title">
            <h2>Mes artistes</h2>
            <span>Ajoute, note et classe tes artistes preferes</span>
          </div>

          <label className="search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Rechercher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <form className="formRow" onSubmit={handleAdd}>
          <input
            className="input"
            type="text"
            placeholder="Nom de l'artiste"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Note"
            min="1"
            max="10"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Rang"
            min="0"
            max="10"
            value={newRank}
            onChange={(e) => setNewRank(e.target.value)}
          />
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ajout..." : "Ajouter"}
          </button>
        </form>

        {loading && <p>Chargement...</p>}

        {error && (
          <div>
            <p style={{ color: "var(--danger)" }}>{error}</p>
            <button className="btn" onClick={fetchArtists} type="button">
              Reessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid">
              {filteredArtists.map((artist) => (
                <article className="card" key={artist.id}>
                  <div className="left">
                    <div className="cover">{artist.name.slice(0, 1).toUpperCase()}</div>
                    <div className="meta">
                      <div className="name">{artist.name}</div>
                      <div className="sub">
                        <span className="rank">{artist.rank === 0 ? "Non classe" : `#${artist.rank}`}</span>
                        <span className="pill">Note {artist.note}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="right">
                    <button
                      className="iconBtn actionBtn edit"
                      onClick={() => handleUpdateNote(artist.id, artist.name, artist.note)}
                      title="Modifier la note"
                      type="button"
                    >
                      📝 Note
                    </button>
                    <button
                      className="iconBtn actionBtn edit"
                      onClick={() => handleUpdateRank(artist.id, artist.rank)}
                      title="Modifier le classement"
                      type="button"
                    >
                      🏆 Rang
                    </button>
                    <button
                      className="iconBtn danger"
                      onClick={() => handleDelete(artist.id, artist.name)}
                      title="Supprimer"
                      type="button"
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredArtists.length === 0 && <p>Aucun artiste trouve.</p>}

            <div className="footer">
              <span>API: {API_URL}</span>
              <span>{filteredArtists.length} artiste(s) affiche(s)</span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
