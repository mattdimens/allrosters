# Fantasy Scoreboard

A single-page live scoreboard for people who play in more than one Sleeper league.
No build step, no server, no API keys — static HTML and one stylesheet.

## Layout

- `index.html` — the whole app: markup, app styles, and the Sleeper data layer.
- `ds/modernist/styles.css` — the Modernist design system (tokens and component
  classes), vendored from the Claude Design project that the interface was
  designed in. Colors, type, spacing and radii all come from its variables;
  the app never hard-codes a hex. Re-sync this file rather than editing it.

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

Then open http://localhost:8000

## Data sources

- `api.sleeper.app` — rosters, matchups, players, projections, weekly stats
- `sleeper.com/graphql` — live NFL game clocks and scores

Both allow cross-origin requests from any origin. Sleeper's public API is
read-only: this app can never change a lineup or submit a waiver claim.

## Configuration

Open the gear icon in the header. Username, refresh cadence, and light/dark are
stored in the browser's localStorage, not in this repo. Modernist is a
light-only system; the dark theme redefines its tokens in `index.html`.

## Privacy

`robots.txt` and the `X-Robots-Tag` header in `vercel.json` keep the site out of
search results. Those are requests, not a lock — for a real gate, turn on Vercel
Authentication in project settings (free on Hobby, scope it to All Deployments).
