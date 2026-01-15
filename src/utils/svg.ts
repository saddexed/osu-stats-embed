import { OsuUser } from "../types";

export interface SvgOptions {
  show_pp?: boolean;
  show_accuracy?: boolean;
  show_playcount?: boolean;
  show_playtime?: boolean;
}

export function generateSvg(user: OsuUser, options: SvgOptions = {}): string {
  // Helper function for k/m/b formatting
  function formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "b";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "m";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  // Parsing stats
  const username = user.username;
  const rank = `#${Number(user.pp_rank).toLocaleString()}`;
  const pp = `${Math.round(Number(user.pp_raw))}`;
  const currentLv = parseInt(user.level);
  const playcount = formatNumber(Number(user.playcount));
  const playtimeHours =
    Math.round(Number(user.total_seconds_played) / 3600).toLocaleString() + "h";
  const accuracy = `${Number(user.accuracy).toFixed(2)}%`;
  const country = user.country;

  // Avatar URL
  const avatarUrl = `https://a.ppy.sh/${user.user_id}`;

  // Flag URL (kept for future use)
  const flagUrl = `https://flagcdn.com/${country.toLowerCase()}.svg`;

  const width = 480;
  const height = 240;

  // Dynamic Stats Configuration
  const {
    show_pp = true,
    show_accuracy = true,
    show_playcount = true,
    show_playtime = true,
  } = options;

  const stats = [
    { text: `${pp}pp`, show: show_pp },
    { text: accuracy, show: show_accuracy },
    { text: `${playcount} plays`, show: show_playcount },
    { text: playtimeHours, show: show_playtime },
  ].filter((s) => s.show);

  // Helper function for Level XP
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

  // Progress calculation
  let progress = 0;
  if (nextScore > currentScore) {
    progress = currentScore / nextScore;
  }
  // Clamp progress between 0 and 1
  progress = Math.max(0, Math.min(1, progress));

  const progressPercent = Math.round(progress * 100);
  const joinDate = user.join_date; // Full date string

  // Layout Logic for Stats
  const startX = 20;
  const totalStatsWidth = width - startX * 2;
  const gap = 8;
  const count = stats.length;
  const cardWidth =
    count > 0 ? (totalStatsWidth - gap * (count - 1)) / count : 0;

  let statsHtml = "";
  if (count > 0) {
    statsHtml = stats
      .map((stat, i) => {
        const xPos = startX + (cardWidth + gap) * i;
        return `
    <rect x="${xPos}" y="140" width="${cardWidth}" height="45" rx="8" class="card-bg" />
    <text x="${
      xPos + cardWidth / 2
    }" y="168" text-anchor="middle" class="stat-value" textLength="${Math.min(
          cardWidth - 10,
          stat.text.length * 10
        )}" lengthAdjust="spacingAndGlyphs">${stat.text}</text>`;
      })
      .join("");
  }

  return `
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

      <pattern id="flagPattern" patternUnits="objectBoundingBox" width="1" height="1">
        <image x="0" y="0" width="${width}px" height="${height}px" preserveAspectRatio="none" xlink:href="${flagUrl}" />
      </pattern>

      <clipPath id="avatar-clip">
        <circle cx="54" cy="54" r="40" />
      </clipPath>
    </defs>

    <style>
      .bg-img { fill: url(#flagPattern); opacity: 0; }
      .username { font: 700 40px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      .rank-value { font: 800 56px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ff66aa; text-anchor: end; font-style: italic; }
      .sub-info { font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: #cbd5e1; }
      .level-text { font: 700 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #00ddff; text-anchor: middle;}
      .lv-bg { fill: #1d7b89; }
      .stat-value { font: 700 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      .card-bg { fill: #1e293b; opacity: 0.5; }
      .xp-bar-bg { fill: #6a6a6aff; }
      .xp-bar-fill { fill: #00ddff; }
      .progress { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #cbd5e1; }
      .join-date { font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: #64748b; }
    </style>

    <!-- Background -->
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" stroke="#333" stroke-width="1" stroke-opacity="0.3" />
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" class="bg-img" stroke="#333" stroke-width="1" stroke-opacity="0.3" />

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
    <rect x="12" y="107" width="80" height="30" rx="3" class="lv-bg" fill="#ffffff" opacity="0.6"/>
    <text x="52" y="128" class="level-text"> Lv. ${currentLv} </text>

    <!-- XP Bar -->
    <rect x="110" y="120" width="340" height="6" rx="3" class="xp-bar-bg" />
    <rect x="110" y="120" width="${
      340 * progress
    }" height="6" rx="3" class="xp-bar-fill" />

    <!-- Level Progress -->
    <rect x="${
      110 + 340 * progress - 20
    }" y="108" width="40" height="20" rx="3" class="lv-bg" opacity="0.8"/>
    <text x="${
      110 + 340 * progress
    }" y="120" class="progress" dominant-baseline="central" text-anchor="middle">${progressPercent}%</text>

    <!-- Stats Grid -->
    ${statsHtml}

    <!-- Join Date -->
    <text x="460" y="228" text-anchor="end" class="join-date">Joined ${joinDate}</text>

  </svg>
  `;
}
