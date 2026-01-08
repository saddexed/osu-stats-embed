import express from "express";
import handler from "./api/index";
import dotenv from "dotenv";
import { VercelRequest, VercelResponse } from "@vercel/node";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Mock Vercel Request/Response objects if necessary, but Express req/res are compatible enough for this simple handler
app.get("/api", async (req, res) => {
  // Cast express req/res to Vercel types (they are compatible)
  await handler(
    req as unknown as VercelRequest,
    res as unknown as VercelResponse
  );
});

app.listen(PORT, () => {
  console.log(
    `Local server running at http://localhost:${PORT}/api?username=YOUR_USERNAME`
  );
  console.log(`Ensure you have OSU_API_KEY in your .env file`);
});
