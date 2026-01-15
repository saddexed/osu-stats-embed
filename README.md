# osu! Stats Embed

[![osu! stats](https://osu-stats-embed.vercel.app/api/saddex)](https://osu.ppy.sh/users/saddex)  
A serverless API that generates dynamic SVG stat cards for osu! players. Perfect for displaying your osu! stats on GitHub profiles, websites, or anywhere that supports SVG images.

## Features

- Dynamic SVG generation with real-time osu! statistics
- Customizable display options via query parameters [wip]
- Beautiful gradient design with avatar, rank, level, and stats [wip]
- XP progress bar with percentage indicator
- Serverless deployment on Vercel

## Quick Start

### Display Your Stats

Add this to your GitHub README or any markdown file:
```md
[![osu! stats](https://osu-stats-embed.vercel.app/api/your_username)](https://osu.ppy.sh/users/your_username)
```
for example:
```md
[![osu! stats](https://osu-stats-embed.vercel.app/api/saddex)](https://osu.ppy.sh/users/saddex)
```

### URL Format

```
https://osu-stats-embed.vercel.app/api/{username}
```

## Customization Options [wip]

Control which stats are displayed using query parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `pp` | `true` | Show performance points |
| `acc` | `true` | Show accuracy percentage |
| `count` | `true` | Show play count |
| `time` | `true` | Show total playtime |
| `hide_all` | `false` | Hide all stats (compact mode) |

### Examples

**Hide accuracy:**
```
/api/saddex?acc=false

/api/saddex?acc=false&count=false&time=false

/api/saddex?hide_all=true
```

## Deployment

### Prerequisites

- Node.js 16+ installed
- Vercel account
- osu! API v1 key ([Get one here](https://osu.ppy.sh/p/api))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/saddexed/osu-stats-embed.git
cd osu-stats-embed
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
OSU_API_KEY=your_api_key_here
```

4. Test locally:
```bash
npm run dev
```

Visit `http://localhost:3000/api/your-username` to see your stats card.

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `OSU_API_KEY` with your osu! API key

4. Your API will be live at `https://your-project.vercel.app/api/username`

## Project Structure

```
osu-stats-embed/
├── src/
│   ├── api/
│   │   └── [username].ts    # Dynamic route handler
│   ├── utils/
│   │   ├── osu.ts           # osu! API client
│   │   └── svg.ts           # SVG generation
│   └── types.ts             # TypeScript types
├── vercel.json              # Vercel configuration
└── package.json
```

## Technical Details

- **Framework:** Vercel Serverless Functions
- **Language:** TypeScript
- **API:** osu! API v1
- **Caching:** 1 hour (3600s) with stale-while-revalidate

## API Response

The API returns an SVG image with:
- User avatar with glow effect
- Username and global rank
- Current level with XP progress bar
- Customizable stats grid (PP, accuracy, playcount, playtime)
- Country flag background (subtle)

## License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- osu! API for providing player statistics
- Vercel for serverless hosting
- Inspired by [osu-score-embed](https://github.com/BRAVO68WEB/osu-score-embed)
