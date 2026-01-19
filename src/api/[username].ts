import { VercelRequest, VercelResponse } from "@vercel/node";
import { getUser } from "../utils/osu";
import { generateSvg } from "../utils/svg";
import { fetchImageAsBase64 } from "../utils/imageUtils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      res.status(400).send("Missing username in path");
      return;
    }

    const apiKey = process.env.OSU_API_KEY;
    if (!apiKey) {
      res.status(500).send("Server configuration error: OSU_API_KEY missing");
      return;
    }

    const user = await getUser(username, apiKey);
    console.log(`queried ${username}`);

    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Fetch avatar as base64 to bypass GitHub's CSP
    const avatarUrl = `https://a.ppy.sh/${user.user_id}`;
    const avatarBase64 = await fetchImageAsBase64(avatarUrl);

    const options = {
      stats: req.query.stats === "true",
    };

    const svg = generateSvg(user, options, avatarBase64);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // Cache for 1 hour
    res.status(200).send(svg);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
