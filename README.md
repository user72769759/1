# KDJ's Internet World

A homemade early-2000s style personal homepage: green tiled background, Comic Sans, yellow text, photo rows and a visitor counter.

| File | What it is |
|---|---|
| `index.html` | The whole site (one page) |
| `style.css` | All the styling |

To add photos, replace each `<div class="photo">` box with `<img src="img/your-photo.jpg" alt="">`.

## Deploy (Cloudflare)

Plain HTML/CSS, no build step. In Cloudflare: Workers & Pages → Create → Import a Git repository.
Framework preset **None**, build command empty, output directory `/`. Every push to `main` redeploys.
