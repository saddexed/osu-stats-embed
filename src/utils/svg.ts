import { OsuUser } from "../types";

export interface SvgOptions {
  stats?: boolean;
}

export function generateSvg(
  user: OsuUser, 
  options: SvgOptions = {}, 
  avatarBase64?: string,
  flagBase64?: string
): string {
  function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "b";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "m";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  const username = user.username;
  const rank = `#${Number(user.pp_rank).toLocaleString()}`;
  const pp = `${Math.round(Number(user.pp_raw))}pp`;
  const currentLv = parseInt(user.level);
  // const playcount = `${formatNumber(Number(user.playcount))} plays`;
  const playcount = `${Number(user.playcount).toLocaleString()}`;
  const playtime = Math.round(Number(user.total_seconds_played) / 3600).toLocaleString() + "h";
  const accuracy = `${Number(user.accuracy).toFixed(2)}%`;
  const country = user.country;
  const country_rank = user.pp_country_rank;

  const avatarUrl = avatarBase64 || `https://a.ppy.sh/${user.user_id}`;

  const width = 480;
  const { stats = false } = options;
  const height = stats ? 240 : 160;

  function getRequiredScore(n: number): number {
    if (n <= 100) {
      return (
        (5000 / 3) * (4 * Math.pow(n, 3) - 3 * Math.pow(n, 2) - n) +
        1.25 * Math.pow(1.8, n - 60)
      );
    }
    return 26931190827 + 99999999999 * (n - 100);
  }

  const nextLv = currentLv + 1;
  const currentScore = Number(user.total_score);
  const nextScore = getRequiredScore(nextLv);

  let progress = 0;
  if (nextScore > currentScore) {
    progress = currentScore / nextScore;
  }
  progress = Math.max(0, Math.min(1, progress));

  const progressPercent = Math.round(progress * 100);

  let response = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <desc>Osu Stats Card for ${username}</desc>
    
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1c2c;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
      </linearGradient>
      
      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff66aa;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#bd34fe;stop-opacity:1" />
      </linearGradient>

      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <clipPath id="avatar-clip">
        <circle cx="54" cy="54" r="40" />
      </clipPath>
    </defs>

    <style>
      .country-bg { fill: url(#flagPattern); opacity: 0.6; }
      .username { font: 700 40px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      .rank-value { font: 800 56px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ff66aa; text-anchor: end; font-style: italic; }
      .sub-info { font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: #cbd5e1; }
      .level-text { font: 700 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #00ddff; text-anchor: middle;}
      .stat-text { font: 700 26px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ffffffff; font-style: italic; }
      .lv-bg { fill: #1d7b89; }
      .stat-value { font: 700 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      .card-bg { fill: #1e293b; opacity: 0.5; }
      .xp-bar-bg { fill: #6a6a6aff; }
      .xp-bar-fill { fill: #00ddff; }
      .progress { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #518f91ff; }
      .join-date { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #64748b; }
    </style>

    <a href="https://osu.ppy.sh/users/${user.user_id}" target="_top">
      <!-- Background -->
      <rect x="0" y="0" width="${width}" height="${height}" rx="15" stroke="#333" stroke-width="1" stroke-opacity="0.3" />
      <rect x="0" y="0" width="${width}" height="${height}" rx="20" class="bg-img" stroke="#333" stroke-width="1" stroke-opacity="0.3" />

      <!-- Avatar Glow Effect -->
      <circle cx="54" cy="54" r="42" fill="url(#glowGradient)" filter="url(#glow)" opacity="0.6" />
      <circle cx="54" cy="54" r="40" fill="#1e1e1e" />
      
      <!-- Avatar Image -->
      <image x="14" y="14" width="80" height="80" clip-path="url(#avatar-clip)" xlink:href="${avatarUrl}" />
      
      <!-- Username -->
      <text x="105" y="35" class="username" dominant-baseline="central">${username}</text>
      
      <!-- Rank -->
      <text x="440" y="80" class="rank-value" dominant-baseline="central">${rank}</text>
      
      <!-- Level Box -->
      <rect x="12" y="107" width="80" height="30" rx="5" class="lv-bg" fill="#ffffff" opacity="0.6"/>
      <text x="52" y="128" class="level-text"> Lv. ${currentLv} </text>
      
      <!-- XP Bar -->
      <rect x="110" y="120" width="295" height="6" rx="3" class="xp-bar-bg" />
      <rect x="110" y="120" width="${295 * progress}" height="6" rx="3" class="xp-bar-fill" />
      <!-- Progress Head -->
      <rect x="${110 + 295 * progress - 10}" y="117" width="20" height="12" rx="3" class="lv-bg" style="fill: #ffffffff;"/>

      <!-- Level Progress -->
      <text x="440" y="122" class="level-text" dominant-baseline="central" text-anchor="middle">${progressPercent}%</text>
  `;
  response += stats ? `<!-- Stats -->

      <!-- Total PlayTime -->
      <svg x="15" y="140" width="40px" height="40px" viewBox="0 0 24 24"><path fill="#fff" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 4a1 1 0 0 0-1 1v5a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V7a1 1 0 0 0-1-1"/></svg>
      <text x="55" y="159" class="stat-text" dominant-baseline="central">${playtime}</text>

      <!-- Country Rank -->
      <image x="425" y="140" width="40" height="40" xlink:href="${flagBase64}" />
      <text x="417" y="159" class="stat-text" dominant-baseline="central" text-anchor="end">#${country_rank}</text>
      
      <!-- pp -->
      <text x="240" y="182" class="stat-text" style="font-style: normal; font-size: 36px;" dominant-baseline="central" text-anchor="middle">${pp}</text>

      <!-- Playcount -->
      <svg x="17" y="190" width="35px" height="35px" viewBox="0 0 24 24"><path fill="#fff" d="M7.755 13.38v6.83a1.54 1.54 0 0 1-1.54 1.54h-1.81a1.54 1.54 0 0 1-1.55-1.54v-6.83a1.54 1.54 0 0 1 1.55-1.55h1.81a1.54 1.54 0 0 1 1.54 1.55m6.7-9.58v16.41a1.54 1.54 0 0 1-1.55 1.54h-1.81a1.55 1.55 0 0 1-1.55-1.54V3.8a1.56 1.56 0 0 1 1.55-1.55h1.81a1.55 1.55 0 0 1 1.55 1.55m6.69 5.18v11.23a1.54 1.54 0 0 1-1.54 1.54h-1.81a1.54 1.54 0 0 1-1.55-1.54V8.98a1.55 1.55 0 0 1 1.55-1.55h1.85a1.55 1.55 0 0 1 1.5 1.55"/></svg>
      <text x="55" y="208" class="stat-text" dominant-baseline="central" text-anchor="start">${playcount}</text>

      <!-- Accuracy -->
      <svg x="425" y="190" width="40px" height="40px" viewBox="0 0 16 16"><path fill="#ffffff" fill-rule="evenodd" d="M13.293 0c.39 0 .707.317.707.707V2h1.293a.707.707 0 0 1 .5 1.207l-1.46 1.46A1.14 1.14 0 0 1 13.53 5h-1.47L8.53 8.53a.75.75 0 0 1-1.06-1.06L11 3.94V2.47c0-.301.12-.59.333-.804l1.46-1.46a.7.7 0 0 1 .5-.207M2.5 8a5.5 5.5 0 0 1 6.598-5.39a.75.75 0 0 0 .298-1.47A7 7 0 1 0 14.86 6.6a.75.75 0 0 0-1.47.299q.109.533.11 1.101a5.5 5.5 0 1 1-11 0m5.364-2.496a.75.75 0 0 0-.08-1.498A4 4 0 1 0 11.988 8.3a.75.75 0 0 0-1.496-.111a2.5 2.5 0 1 1-2.63-2.686" clip-rule="evenodd"/></svg>
      <text x="420" y="208" class="stat-text" dominant-baseline="central" text-anchor="end">${accuracy}</text>
      
      <!-- Join Date -->
      <!-- <text x="460" y="228" text-anchor="end" class="join-date">Joined ${user.join_date}</text> -->
      </a>
    </svg>
  ` : `
    </a>
    </svg>
  `
  return response;
}

