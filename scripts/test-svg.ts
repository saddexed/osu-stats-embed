import { generateSvg } from "../src/utils/svg";
import * as fs from "fs";
import * as path from "path";
import { OsuUser } from "../src/types";

const mockUser: OsuUser = {
  user_id: "123456",
  username: "TestUser",
  join_date: "2020-01-01",
  count300: "1000",
  count100: "100",
  count50: "10",
  playcount: "5000",
  ranked_score: "1000000",
  total_score: "5000000",
  pp_rank: "1234",
  level: "98.5",
  pp_raw: "4500.5",
  accuracy: "99.12",
  count_rank_ss: "10",
  count_rank_ssh: "5",
  count_rank_s: "50",
  count_rank_sh: "20",
  count_rank_a: "100",
  country: "US",
  total_seconds_played: "360000", // 100 hours
  pp_country_rank: "100",
  events: [],
};

const svg = generateSvg(mockUser);
const outputPath = path.resolve(__dirname, "..", "test_output.svg");

fs.writeFileSync(outputPath, svg);
console.log(`SVG generated at ${outputPath}`);
