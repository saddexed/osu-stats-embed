import axios from "axios";
import { OsuUser } from "../types";

const API_BASE = "https://osu.ppy.sh/api";

export async function getUser(
  username: string,
  apiKey: string
): Promise<OsuUser | null> {
  if (!apiKey) {
    throw new Error("OSU_API_KEY is not defined");
  }

  try {
    const response = await axios.get<OsuUser[]>(`${API_BASE}/get_user`, {
      params: {
        k: apiKey,
        u: username,
      },
    });

    if (response.data && response.data.length > 0) {
      console.log(response.data);
      return response.data[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching osu! user:", error);
    throw error;
  }
}
