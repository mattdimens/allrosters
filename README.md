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
- `assets/leagues.css` — league colors (`--league-0` to `--league-7`, in both
  themes), shared by the scoreboard and the homepage's picture of it. They are the
  one addition to Modernist's palette. Red stays the signal color (live, win
  odds, lost points), so each league takes its own hue, in order, for its
  stripe, name, tab underline and letter chip. A solid chip beside a player means
  they're yours in that league; an outlined chip means they start against you
  there. Every value clears 4.5:1 contrast in both themes.
- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`, `site.webmanifest` — icons and the install manifest.
- `og.png` — the 1200×630 share image. When you replace it, bump the `?v=` on
  its URLs in `index.html` so link previews fetch the new one.
- `robots.txt`, `sitemap.xml`, `llms.txt` — for search and AI crawlers.

Asset paths are root-relative (`/ds/...`), so every page must be served from a
server, never opened as a file.

Two screens. The home screen is every league at once: up to four leagues get a
card each, and past four every league becomes a compact row. A card shows the
score, a 20-square win-probability matrix and what your bench is costing you.
Below the leagues are your starters on the field right now, or the next
kickoffs that involve them. Tapping a league opens the detail screen: the
scores, a win gauge, and four tabs (lineup, head-to-head matchup, game clocks,
standings). Any player row opens a
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

Username, refresh cadence, light/dark, and hidden leagues are stored in the browser's
localStorage (`sb_cfg`), which is how visitors see their leagues again with no
account. The app also asks for persistent storage. localStorage can still
disappear: Safari clears a site's storage after 7 days without a visit, a
home-screen app keeps storage separate from Safari, and private windows keep
nothing. For those cases, Settings shows each visitor a personal
`/scoreboard?user=name` link to bookmark or open on another device, plus a
button to switch to a different account. Modernist is a
light-only system; the dark theme redefines its tokens in `index.html`.

## Search and privacy

The homepage is indexable. `/scoreboard` carries `noindex, follow` because it is a
personal page rendered in the browser; the 404 page is `noindex` too. Any host
other than allrosters.com (preview deployments, allrosters.vercel.app) gets an
`X-Robots-Tag: noindex` header from `vercel.json`, so copies of the site never
compete with the real one. `robots.txt` allows every crawler, AI search included,
because a crawler blocked there can't see a noindex tag.

After a launch-affecting change:

1. In Google Search Console and Bing Webmaster Tools (Bing also feeds ChatGPT
   search and Copilot), submit `/sitemap.xml` and request indexing for `/`.
2. Check the homepage in Google's Rich Results Test and a social card debugger.

When a page's content changes, update its `lastmod` in `sitemap.xml` and
`dateModified` in the homepage's JSON-LD.
