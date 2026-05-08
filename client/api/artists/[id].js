import { deleteArtist, updateArtist } from "../_artistsStore.js";

export default function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "id invalide" });

  if (req.method === "PUT") {
    const result = updateArtist(id, req.body || {});
    if (result.error) return res.status(result.status).json({ error: result.error });

    return res.status(result.status).json(result.artist);
  }

  if (req.method === "DELETE") {
    const result = deleteArtist(id);
    if (result.error) return res.status(result.status).json({ error: result.error });

    return res.status(result.status).json(result.artist);
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: "Méthode non autorisée" });
}
