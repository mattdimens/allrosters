# Fantasy Scoreboard

A single-page live scoreboard for people who play in more than one Sleeper league.
No build step, no server, no API keys — one static HTML file.

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

Open the gear icon in the app. Username, refresh cadence, and light/dark are
stored in the browser's localStorage, not in this repo.

## Privacy

`robots.txt` and the `X-Robots-Tag` header in `vercel.json` keep the site out of
search results. Those are requests, not a lock — for a real gate, turn on Vercel
Authentication in project settings (free on Hobby, scope it to All Deployments).
