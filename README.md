# Office Days

A simple, personal attendance tracker for hybrid workplaces. Log the days you go to the office, see how many you still owe this month, and keep a record for the whole year.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no server, no account.

## Features

- **Configurable target.** Set the number of required office days per month (1 to 31). Works for any organization or policy, not just 8 days a month.
- **One-tap logging.** Tap a day to cycle through Office, Home, Leave, and blank.
- **Progress at a glance.** A progress ring, a plain-language message, and monthly counts for Office, Home, and Leave.
- **Target warnings.** During the current month it tells you how many working days remain and warns you when the target can no longer be met.
- **Year overview.** Twelve month tiles show your count against the target. Past months that missed the target are highlighted.
- **Mobile friendly.** The layout fills the screen on phones, tablets, and desktops. Swipe the calendar to change month.
- **Private by design.** Data is stored in your browser's `localStorage`. Nothing is sent anywhere.
- **Backup and restore.** Export your log to a JSON file and import it on another device.
- **Print support.** Print the current month for your records.
- **Light and dark mode.** Follows your device setting.

## Getting started

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in any modern browser.

To host it, upload the three files to any static host, such as GitHub Pages, Netlify, or an internal web server.

### Publish with GitHub Pages

1. Push the files to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select your branch and the root folder.
4. Save. Your tracker will be available at `https://<your-username>.github.io/<repo-name>/`.

## Usage

| Action | How |
| --- | --- |
| Mark a day | Tap or click it. Each tap cycles Office, Home, Leave, then clears it |
| Change month | Use the arrow buttons, swipe the calendar, or tap a month tile |
| Jump to this month | Tap **Today** |
| Change target, name, or organization | Open the menu (☰) |
| Count Saturday as a working day | Menu (☰), then tick **Saturday is a working day** |
| Back up or restore | Menu (☰), then **Export backup** or **Import backup** |

Leave days are recorded but do not reduce your monthly target.

## Customizing

Open the menu (☰) to set:

- **Your name** and **organization**, which appear in the page header
- **Office days required per month**
- **Saturday as a working day** for organizations with a six-day week

Colors are defined as CSS variables at the top of `style.css`, so you can match your organization's branding by editing a few values.

## Project structure

```
.
├── index.html   # Page structure
├── style.css    # Layout, theme, and responsive styles
└── script.js    # Calendar, counting, storage, import and export
```

## Data and privacy

Everything is stored in the browser under the key `officeLogbook.v1`. Clearing your browser data removes the log, so use **Export backup** regularly. The only external request is the Google Fonts stylesheet in `index.html`. Without it, the app falls back to your system font.

### Backup format

```json
{
  "settings": { "name": "", "org": "", "target": 8, "sat": false },
  "days": { "2026-09-30": "O", "2026-09-29": "W" }
}
```

Day values are `O` (office), `W` (work from home), and `L` (leave or holiday).

## Browser support

Any current version of Chrome, Edge, Firefox, or Safari, on desktop or mobile.

## Limitations

- Data lives in one browser on one device. Use export and import to move it.
- Tracks a single person per browser.
- The target is one number applied to every month.
