import axios from "axios";

/**
 * Fetches an image from a URL and converts it to a base64 data URI
 */
export async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
      timeout: 5000,
    });

    const base64 = Buffer.from(response.data as ArrayBuffer).toString("base64");
    const contentType = response.headers["content-type"] || "image/jpeg";
    
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Failed to fetch image from ${url}:`, error);
    // Return a transparent 1x1 pixel as fallback
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  }
}
