# MAMAP Onboarding Demo

A demo build of the Michigan Advanced Manufacturing Adoption Program (MAMAP)
application/vetting/dashboard flow, built for the Automation Alley Grant
Program Manager assessment.

**This is a static, front-end-only demo.** There is no backend and no
database. All application data lives in memory in the visitor's browser tab
and resets on refresh — see "How data works" below before you demo this live.

## 1. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Edit `src/App.jsx` and it hot-reloads.

## 2. Deploy to GitHub Pages

One-time setup:

1. Push this folder to a new GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to **GitHub Actions**.
4. Push to `main` (or click **Run workflow** under the Actions tab).

The included workflow (`.github/workflows/deploy.yml`) builds the app and
deploys it automatically on every push to `main` — no manual build step, no
`gh-pages` branch to manage. After the first successful run, your link is:

```
https://<your-username>.github.io/<your-repo-name>/
```

Find it under **Settings → Pages** once the first deploy finishes (usually
under a minute).

## 3. How data works (read this before sending the link)

Every application, score, and login is stored in React state — plain
JavaScript memory in that one browser tab. There is no server and nothing is
saved anywhere:

- If **you** open the link and add a test company, only your tab sees it.
  Refresh, and it's gone.
- If you **share the link**, whoever opens it always starts from the same
  baseline data below — they will never see anything you typed in your own
  session, no matter how long you leave it open.

## 4. Adding or changing test companies (the simple way)

Since this doesn't need a real database yet, the way to make a change
visible to *everyone* who opens the link is to bake it into the source and
redeploy:

1. Open `src/App.jsx`.
2. Find `const seedApplications = () => [ ... ]` near the top.
3. Add, edit, or remove an application object in that array. Match the shape
   of the existing entries (see any one of the five for the full field list —
   `ref`, `company`, `employees`, `scores`, etc.).
4. Commit and push to `main`. The GitHub Actions workflow rebuilds and
   redeploys automatically — give it about a minute.

That new baseline is now what *everyone* sees when they open the link, until
you change it again.

## 5. The "Suggest starting scores" button and the API

The Vetting Committee view has an AI-assisted scoring suggestion button. It
first tries a live call to Anthropic's API. When this app runs inside
Claude.ai's own artifact environment, that call is authenticated
automatically. **Once deployed to GitHub Pages as a plain static site, there
is no backend and no API key, so that live call will always fail** — the app
detects this (via a timeout) and automatically falls back to a transparent,
rule-based heuristic that scores off the same structured fields (automation
maturity level, jobs impact, timeline, etc.), clearly labeled **"Heuristic
(offline mode)"** next to the button so it's never presented as something
it isn't. Nothing breaks or shows an error in front of whoever is viewing it.

If you later want the live AI scoring to actually run on the hosted version,
that requires a small backend (even a single serverless function) to hold an
API key server-side — deliberately left out here to keep this deploy simple,
per the current scope.

## 6. What's demo-only vs. real

- **Login gate** (Vetting Committee / Dashboard): not a real auth system —
  clearly labeled as such on the sign-in screen. It only personalizes the
  session (shows your name in the header).
- **Eligibility check**: a simplified employee-count proxy, not the real
  SBA per-NAICS determination — the app links to the actual SBA Size
  Standards Tool and says so explicitly.
- **Scoring rubric and weighted-total math**: fully real and functional —
  not a mockup. The weights, formula, and recommendation bands are all live.
