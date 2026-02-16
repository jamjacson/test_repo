# How to Share with the Team (SharePoint)

No coding or terminal required! Follow these steps to put the app on SharePoint so everyone can use it.

## What You Need

- Access to your firm's SharePoint site
- The `dist` folder from this project (that's the ready-to-use app)

## Steps

1. **Find the `dist` folder** in this project — it contains the built app (index.html and an assets folder).

2. **Go to your SharePoint site** in the browser.

3. **Create a new folder** in your SharePoint document library, e.g. `XPM Structure Diagrams`.

4. **Upload everything inside the `dist` folder** into that SharePoint folder:
   - `index.html`
   - `assets/` folder (drag the whole folder in)
   - `vite.svg` (if present)

5. **Get the link to `index.html`**:
   - Click on `index.html` in SharePoint
   - It should open in the browser — that's your app!
   - Copy the URL from your browser's address bar

6. **Share that link with your team** — they just click it and the app opens. Bookmark it!

## Tips

- The app runs entirely in the browser. No server needed. Your XPM data goes directly from ODataLink to each person's browser — nothing is stored on SharePoint.
- If SharePoint tries to download the HTML file instead of opening it, try right-clicking and choosing "Open in browser" or "Preview".
- To update the app later, just replace the files in the SharePoint folder with new ones from the `dist` folder.

## Alternative: Shared Network Drive

If you'd prefer to use a network drive instead of SharePoint:

1. Copy the `dist` folder to a shared network location, e.g. `\\server\shared\XPM Diagrams\`
2. Each team member opens `index.html` from that folder in their browser (Chrome or Edge recommended)
3. Create a desktop shortcut to `index.html` for quick access
