# osu! Stats Embed

![typescript](https://img.shields.io/badge/typescript-lightgrey?style=typescript&logo=typescript)
![License](https://img.shields.io/github/license/saddexed/osu-stats-embed)

[![osu! stats](https://osu-stats-embed.vercel.app/api/saddex)](https://osu.ppy.sh/users/saddex)  
A serverless API that generates dynamic SVG stat cards for osu! players. Perfect for displaying your osu! stats on GitHub profiles (why would you want to do that huh), websites, or anywhere that supports SVG images. If ANY of you ever say this is AI I will hunt you down and kill you. Spent like 2 days on just absolute positioning and people be like "oh its AI".  

## Features

- Dynamic SVG generation with real-time osu! statistics
- Extended stats display option via query parameters 
- XP progress bar with percentage indicator
- Serverless deployment on Vercel

## Quick Start

### Display Your Stats

Add this to your GitHub README or any markdown file:
```md
[![osu! stats](https://osu-stats-embed.vercel.app/api/your_username?stats=true)](https://osu.ppy.sh/users/your_username)
```

### URL Format

```
https://osu-stats-embed.vercel.app/api/{username}
```

## Customization Options

Control which stats are displayed using query parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `stats` | `false` | Show extended stats |

```
/api/elirif?stats=true
```
[![osu! stats](https://osu-stats-embed.vercel.app/api/elirif?stats=true)](https://osu.ppy.sh/users/elirif)

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


## License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Acknowledgments

- osu! API for providing player statistics
- Vercel for serverless hosting
- Inspired by [osu-score-embed](https://github.com/BRAVO68WEB/osu-score-embed)
