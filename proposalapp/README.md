# Proposal App — Local run & Azure deploy

This is a small static web app that asks questions to unlock photos and ends with a marriage proposal.

Local run (Node required):

1. Open a terminal in this folder.
2. Run:

```bash
npm install
npm start
```

3. Open http://localhost:3000 in your browser.

How it works:
- `server.js` serves files (no external dependencies).
- `index.html`, `styles.css`, `script.js` implement the UI.
- Replace files in `assets/photos/` with your real photos (keep filenames or update `index.html`).

Deploy to Azure Static Web Apps:
1. Push this project to your GitHub repository (e.g. `rohitnallamey/proposalapp`).
2. In the Azure Portal create a *Static Web App*, connect your GitHub repo, and point the app artifact location to `/`.
3. Azure will build and host the static site automatically.

If you want, I can help create the GitHub Actions workflow and push the files.
