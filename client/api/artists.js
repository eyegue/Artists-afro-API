import { createArtist, getArtists } from "./_artistsStore.js";

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(getArtists());
  }

  if (req.method === "POST") {
    const result = createArtist(req.body || {});
    if (result.error) return res.status(result.status).json({ error: result.error });

    return res.status(result.status).json(result.artist);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Méthode non autorisée" });
}
