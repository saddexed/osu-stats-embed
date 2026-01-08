export interface OsuUser {
  user_id: string;
  username: string;
  join_date: string;
  count300: string;
  count100: string;
  count50: string;
  playcount: string;
  ranked_score: string;
  total_score: string;
  pp_rank: string;
  level: string;
  pp_raw: string;
  accuracy: string;
  count_rank_ss: string;
  count_rank_ssh: string;
  count_rank_s: string;
  count_rank_sh: string;
  count_rank_a: string;
  country: string;
  total_seconds_played: string;
  pp_country_rank: string;
  events: any[]; // We don't strictly need events for this
}
