import { OsuUser } from "../types";

export interface SvgOptions {
  show_pp?: boolean;
  show_accuracy?: boolean;
  show_playcount?: boolean;
  show_playtime?: boolean;
}

export function generateSvg(user: OsuUser, options: SvgOptions = {}): string {
  // Parsing stats
  const username = user.username;
  const rank = `#${Number(user.pp_rank).toLocaleString()}`;
  const pp = `${Math.round(Number(user.pp_raw))}`;
  const level = `Lv. ${Number(user.level).toFixed(2)}`;
  const playcount = Number(user.playcount).toLocaleString();
  const playtimeHours =
    Math.round(Number(user.total_seconds_played) / 3600).toLocaleString() + "h";
  const accuracy = `${Number(user.accuracy).toFixed(2)}%`;
  const country = user.country;

  // Avatar URL
  const avatarUrl = `https://a.ppy.sh/${user.user_id}`;

  const width = 500; // Reduced width
  const height = 220; // Reduced height

  // Dynamic Stats Configuration
  const {
    show_pp = true,
    show_accuracy = true,
    show_playcount = true,
    show_playtime = true,
  } = options;

  const stats = [
    { label: "PP", value: pp, show: show_pp },
    { label: "ACCURACY", value: accuracy, show: show_accuracy },
    { label: "PLAYCOUNT", value: playcount, show: show_playcount },
    { label: "PLAYTIME", value: playtimeHours, show: show_playtime },
  ].filter((s) => s.show);

  // Layout Logic
  const startX = 30;
  const totalStatsWidth = width - startX * 2; // 440px available
  const gap = 10;
  const count = stats.length;
  // If no stats are shown, we handle gracefully
  const cardWidth =
    count > 0 ? (totalStatsWidth - gap * (count - 1)) / count : 0;

  let statsHtml = "";
  if (count > 0) {
    statsHtml = stats
      .map((stat, i) => {
        const xPos = (cardWidth + gap) * i;
        return `
      <g transform="translate(${xPos}, 0)">
        <rect x="0" y="0" width="${cardWidth}" height="80" rx="8" class="card-bg" />
        <text x="${
          cardWidth / 2
        }" y="25" text-anchor="middle" class="stat-label">${stat.label}</text>
        <text x="${
          cardWidth / 2
        }" y="55" text-anchor="middle" class="stat-value">${stat.value}</text>
      </g>`;
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

      <clipPath id="avatar-clip">
        <circle cx="55" cy="55" r="35" />
      </clipPath>
    </defs>

    <style>
      .bg { fill: url(#bgGradient); }
      .card-bg { fill: #1e293b; opacity: 0.5; }
      
      .username { font: 700 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      .rank-label { font: 600 10px 'Segoe UI', Ubuntu, Sans-Serif; fill: #94a3b8; letter-spacing: 1px; }
      .rank-value { font: 800 30px 'Segoe UI', Ubuntu, Sans-Serif; fill: #ff66aa; }
      
      .sub-info { font: 400 15px 'Segoe UI', Ubuntu, Sans-Serif; fill: #cbd5e1; }
      .sub-icon { fill: #fbbf24; } /* gold for star */
      .country-icon { fill: #38bdf8; } /* blue for globe */
      
      .stat-label { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
      .stat-value { font: 700 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fff; }
      
      .divider { stroke: #334155; stroke-width: 1; }
    </style>

    <!-- Background -->
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" class="bg" stroke="#333" stroke-width="1" stroke-opacity="0.3" />

    <!-- Avatar Glow Effect -->
    <circle cx="55" cy="55" r="38" fill="url(#glowGradient)" filter="url(#glow)" opacity="0.6" />
    <circle cx="55" cy="55" r="36" fill="#1e1e1e" /> <!-- Border behind avatar -->
    
    <!-- Avatar Image -->
    <image x="20" y="20" width="70" height="70" clip-path="url(#avatar-clip)" xlink:href="${avatarUrl}" />

    <!-- Top Section -->
    <g transform="translate(110, 50)">
      <text x="0" y="-12" class="username" dominant-baseline="central">${username}</text>
      
      <g transform="translate(0, 18)">
        <!-- Level Section -->
        <g class="sub-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <g transform="translate(0, -12) scale(0.8)">
            <path d="M18.483 16.767A8.5 8.5 0 0 1 8.118 7.081a1 1 0 0 1-.113.097c-.28.213-.63.292-1.33.45l-.635.144c-2.46.557-3.69.835-3.983 1.776c-.292.94.546 1.921 2.223 3.882l.434.507c.476.557.715.836.822 1.18c.107.345.071.717-.001 1.46l-.066.677c-.253 2.617-.38 3.925.386 4.506s1.918.052 4.22-1.009l.597-.274c.654-.302.981-.452 1.328-.452s.674.15 1.329.452l.595.274c2.303 1.06 3.455 1.59 4.22 1.01c.767-.582.64-1.89.387-4.507z"/>
            <path fill="#7d00f1" d="m9.153 5.408l-.328.588c-.36.646-.54.969-.82 1.182q.06-.045.113-.097a8.5 8.5 0 0 0 10.366 9.686l-.02-.19c-.071-.743-.107-1.115 0-1.46c.107-.344.345-.623.822-1.18l.434-.507c1.677-1.96 2.515-2.941 2.222-3.882c-.292-.941-1.522-1.22-3.982-1.776l-.636-.144c-.699-.158-1.049-.237-1.33-.45c-.28-.213-.46-.536-.82-1.182l-.327-.588C13.58 3.136 12.947 2 12 2s-1.58 1.136-2.847 3.408"/>
          </g>
        </g>
        <text x="26" y="0" class="sub-info" dominant-baseline="middle">${level}</text>
        
        <!-- Country Section -->
        <g transform="translate(135, 0)">
          <g transform="translate(0, -11) scale(0.8)" class="country-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/>
          </g>
          <text x="24" y="0" class="sub-info" dominant-baseline="middle">${country}</text>
        </g>
      </g>
    </g>

    <!-- Rank Section (Top Right) -->
    <g transform="translate(${width - 30}, 50)" text-anchor="end">
      <text x="0" y="-10" class="rank-value" dominant-baseline="central">${rank}</text>
      <text x="0" y="16" class="rank-label" dominant-baseline="central">GLOBAL RANK</text>
    </g>

    <!-- Divider -->
    <line x1="30" y1="100" x2="${width - 30}" y2="100" class="divider" />

    <!-- Stats Grid -->
    <g transform="translate(${startX}, 120)">
      ${statsHtml}
    </g>

  </svg>
  `;
}
