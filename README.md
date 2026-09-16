# AllRosters

A live scoreboard for people who play in more than one Sleeper league, at
https://allrosters.com. No build step, no server, no API keys — static HTML.

## Layout

| URL | File | |
|---|---|---|
| `/` | `index.html` | Homepage: what it is, how it works, FAQ. The page meant to rank. |
| `/scoreboard` | `scoreboard/index.html` | The whole app: markup, app styles, and the Sleeper data layer. `noindex, follow`. |
| (any miss) | `404.html` | |

- `ds/modernist/styles.css` — the Modernist design system (tokens and component
  classes), vendored from the Claude Design project that the interface was
  designed in. Colors, type, spacing and radii all come from its variables;
  the pages never hard-code a hex. Re-sync this file rather than editing it.
- `assets/dark.css` — the dark theme, shared by every page.
- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`, `site.webmanifest` — icons and the install manifest.
- `og.png` — the 1200×630 share image.
- `robots.txt`, `sitemap.xml`, `llms.txt` — for search and AI crawlers.

Asset paths are root-relative (`/ds/...`), so every page must be served from a
server, never opened as a file.

Two screens. The home screen is every league at once: a cell per league with
the score, a 20-square win-probability matrix and what your bench is costing
you, then the players of yours who are on the field right now. Tapping a
league opens the detail screen — full matchup, win gauge, and four tabs (your
lineup, game clocks, your opponent, the standings). Any player row opens a
point-by-point breakdown of how their score was earned, priced with that
league's own scoring settings.

## Run it locally

You cannot just double-click `index.html`. Browsers block network requests from
`file://` pages, so the app would render but never load data. Serve it instead:

    python3 -m http.server 8000

Then open http://localhost:8000 (homepage) or http://localhost:8000/scoreboard/

## Data sources

- `api.sleeper.app` — rosters, matchups, players, projections, weekly stats
- `sleeper.com/graphql` — live NFL game clocks and scores

Both allow cross-origin requests from any origin. Sleeper's public API is
read-only: this app can never change a lineup or submit a waiver claim.

## Configuration and returning visitors

There is no default username. A first visit to `/scoreboard` asks for one, and
it's checked against Sleeper before it's saved, so a typo never replaces a
username that works. The homepage form does the same thing by opening
`/scoreboard?user=name`; the app saves the name and then takes `?user=` out of the address.

Username, refresh cadence, and light/dark are stored in the browser's
localStorage (`sb_cfg`), which is how visitors see their leagues again with no
account. The app also asks for persistent storage. localStorage can still
disappear: Safari clears a site's storage after 7 days without a visit, a
home-screen app keeps storage separate from Safari, and private windows keep
nothing. For those cases, Settings shows each visitor a personal
`/scoreboard?user=name` link to bookmark or open on another device, plus a
button to switch to a different account. Modernist is a
light-only system; the dark theme redefines its tokens in `index.html`.

## Search and privacy

While the site is private, the `X-Robots-Tag: noindex` header on `/(.*)` in
`vercel.json` keeps every page out of search results. `robots.txt` deliberately
allows crawling: a crawler blocked by robots.txt never sees the noindex header,
and can still list the bare URL. The header is a request, not a lock — for a
real gate, turn on Vercel Authentication in project settings.

To launch:

1. Delete the `X-Robots-Tag` entry from the `/(.*)` block in `vercel.json`.
   The homepage becomes indexable; `/scoreboard` stays out by its own meta tag.
2. Add allrosters.com to Google Search Console and Bing Webmaster Tools
   (Bing also feeds ChatGPT search and Copilot) and submit `/sitemap.xml`.
3. Validate the homepage in Google's Rich Results Test and a social card debugger.

When a page's content changes, update its `lastmod` in `sitemap.xml` and
`dateModified` in the homepage's JSON-LD.
