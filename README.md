# 🌐 KDJ's Internet World

A personal homepage with a proud early-2000s spirit: marquees, blinking text, a visitor counter, a guestbook, and way too many sparkles.

## Pages

| File | What's on it |
|---|---|
| `index.html` | Home: welcome box, what's new, thought of the day, poll |
| `about.html` | About me profile |
| `cool.html` | Magic 8-Ball, smiley collection, virtual pet hamster |
| `links.html` | Favorite links, link-to-me code, 88x31 buttons |
| `guestbook.html` | Guestbook (saved in the visitor's browser for now) |
| `style.css` | All the retro styling |
| `script.js` | Shared sidebar/footer, counter, MIDI-style music player, sparkle cursor, Konami code |

## Run locally

It's plain HTML/CSS/JS, no build step. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## Deploy (Cloudflare)

Connect this repo in Cloudflare (Workers & Pages → Create → Import a Git repository).

- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `/`

Every push to `main` redeploys automatically.

## Roadmap

- [ ] Real shared guestbook and visitor counter (Supabase)
- [ ] Custom domain
- [ ] More sparkles
