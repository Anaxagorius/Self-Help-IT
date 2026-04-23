# IT Self-Help Portal — Valley Credit Union

A fully self-contained IT self-help web portal for Valley Credit Union staff, packaged as a **Microsoft Teams personal tab app**.  Staff can troubleshoot the most common IT issues before contacting the IT Service Desk, reducing call volume and getting members served faster.

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Structure](#repository-structure)
3. [Features](#features)
4. [Teams App Deployment](#teams-app-deployment)
5. [Standalone Web Portal](#standalone-web-portal)
6. [Customising Content](#customising-content)
7. [Dark Mode & Theming](#dark-mode--theming)
8. [File Reference](#file-reference)
9. [Tech Stack](#tech-stack)
10. [IT Contacts](#it-contacts)

---

## Overview

The portal is a single-page HTML/CSS/JS application — no back-end, no build tools, no dependencies beyond a static web host.  It runs equally well:

- **Inside Microsoft Teams** as a personal tab (the primary deployment target — see `VCU_IT_Self_Help_Complete_Teams_App/`)
- **As a standalone intranet page** accessible from any browser (the root-level `index.html` and its companion pages)

---

## Repository Structure

```
Self-Help-IT/
│
├── VCU_IT_Self_Help_Complete_Teams_App/   ← Teams app package
│   ├── index.html                         ← Full portal (all categories, self-contained)
│   ├── manifest.json                      ← Teams app manifest (edit before deploying)
│   ├── color-icon.png                     ← 192×192 colour icon (Teams requirement)
│   ├── outline-icon.png                   ← 32×32 transparent outline icon (Teams requirement)
│   └── js/
│       └── main.js                        ← Search, accordions, theme, status board, back-to-top
│
├── index.html                             ← Standalone portal home page (multi-page version)
├── index2.html                            ← Source / reference: single-page all-in-one portal
├── passwords.html                         ← Standalone passwords & accounts page
├── network.html                           ← Standalone internet & network page
├── email.html                             ← Standalone email & calendar page
├── printers.html                          ← Standalone printers & scanners page
├── computer.html                          ← Standalone computer performance page
├── phones.html                            ← Standalone phones & Teams page
├── banking.html                           ← Standalone core banking systems page
├── mambu.html                             ← Standalone Mambu (loan origination) page
├── software.html                          ← Standalone software & apps page
│
├── css/
│   └── styles.css                         ← Shared stylesheet for the multi-page version
│
├── js/
│   └── main.js                            ← Shared JavaScript for the multi-page version
│
├── images/
│   └── vcu-logo-icon.svg                  ← VCU logo (used in portal header and footer)
│
├── IT_Quick_Reference.pdf                 ← Printable quick-reference card for staff
├── IT_SOP_CAF_Formatted_v1_1.docx        ← IT Standard Operating Procedure (Change & Access)
└── IT_SOP_Self_Help_Portal.docx          ← IT SOP for the Self-Help Portal itself
```

> **Two versions of the portal exist:**
> - The **multi-page version** (root-level files) uses separate HTML files per category and a shared stylesheet/JS.
> - The **single-page / Teams version** (`index2.html` and `VCU_IT_Self_Help_Complete_Teams_App/index.html`) contains all categories in one file for easy deployment inside Teams.

---

## Features

| Feature | Detail |
|---|---|
| **9 help categories** | Passwords & Accounts · Internet & Network · Email & Calendar · Printers & Scanners · Computer Performance · Phones & Teams · Core Banking · Mambu · Software & Apps |
| **45+ step-by-step guides** | Accordion cards with numbered steps, tip / warning / call-IT highlight boxes |
| **Live search** | Instant keyword search across all guide titles, intro text and steps with highlighted matches |
| **System Status board** | Shows operational status of Core Banking, M365, VPN, Wi-Fi, Teams, OneDrive, and MFA |
| **"Call IT" emergency section** | Red-flagged list of situations requiring immediate IT intervention, with direct contact details |
| **Good Habits & Quick Tips** | Six best-practice reminders (restart weekly, lock screen, phishing awareness, OneDrive, MFA, etc.) |
| **Dark / Light mode** | Toggle with OS-preference detection and `localStorage` persistence |
| **Alert banner** | Dismissible yellow banner for broadcasting known outages or incidents |
| **Sticky category nav bar** | Sub-navigation for fast jumping between sections |
| **Back to top button** | Floating button that appears after scrolling 400 px |
| **Responsive design** | Works on desktop, laptop, and tablet screens |
| **Accessible** | Skip link, ARIA labels, keyboard navigation on accordions and quick-link cards |
| **Microsoft Teams SDK** | `microsoftTeams.app.initialize()` called on load so Teams recognises and registers the tab |

---

## Teams App Deployment

### Prerequisites

- A place to **host static files** over HTTPS.  Options include:
  - **Azure Static Web Apps** (recommended for Microsoft 365 environments — integrates with GitHub)
  - **SharePoint Online** (host files in a document library, enable direct file serving)
  - Any web server or CDN with a valid TLS certificate (nginx, IIS, GitHub Pages, Cloudflare Pages, etc.)
- **Microsoft Teams admin access** to upload custom apps, or ask your M365 administrator to publish it to the organisational app catalogue.

---

### Step 1 – Host the web app

Copy the following files/folders to your web host under a single directory (e.g. `https://yourhost.com/itselfhelp/`):

```
index.html           (from VCU_IT_Self_Help_Complete_Teams_App/)
js/
    main.js          (from VCU_IT_Self_Help_Complete_Teams_App/js/)
images/
    vcu-logo-icon.svg  (copy from repo root images/ folder)
```

The `images/` folder must sit at the **same level** as `index.html` so the relative path `images/vcu-logo-icon.svg` resolves correctly.  If you prefer a different directory layout, do a find-and-replace on `images/vcu-logo-icon.svg` inside `index.html`.

Verify the app loads in a browser at the hosted URL before continuing.

---

### Step 2 – Update the manifest

Open `VCU_IT_Self_Help_Complete_Teams_App/manifest.json` and replace every `REPLACE` placeholder with your actual values:

```jsonc
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  // ← Generate a new GUID (see below)
  "developer": {
    "name": "Valley Credit Union IT",
    "websiteUrl":    "https://yourhost.com/itselfhelp",
    "privacyUrl":    "https://yourhost.com/itselfhelp/privacy.html",
    "termsOfUseUrl": "https://yourhost.com/itselfhelp/terms.html"
  },
  "staticTabs": [{
    "contentUrl": "https://yourhost.com/itselfhelp/index.html",
    "websiteUrl": "https://yourhost.com/itselfhelp/index.html"
  }],
  "validDomains": ["yourhost.com"]
}
```

**Generate a unique app GUID:**
- Linux / macOS: `uuidgen`
- Online: [guidgenerator.com](https://www.guidgenerator.com)
- PowerShell: `[System.Guid]::NewGuid().ToString()`

> The `privacyUrl` and `termsOfUseUrl` must be reachable HTTPS pages.  For internal apps a simple hosted HTML page or a SharePoint page is acceptable.

---

### Step 3 – Package the app

Create a `.zip` file containing **only these three items** (no parent folder inside the zip):

```
manifest.json
color-icon.png
outline-icon.png
```

```bash
# Run from inside VCU_IT_Self_Help_Complete_Teams_App/
zip VCU_IT_SelfHelp.zip manifest.json color-icon.png outline-icon.png
```

---

### Step 4 – Upload to Teams

**Option A — Upload for personal use / testing:**
1. Open Microsoft Teams → Apps (left rail) → **Manage your apps**
2. Click **Upload an app** → **Upload a custom app**
3. Select `VCU_IT_SelfHelp.zip`
4. Click **Add**

**Option B — Deploy org-wide via Teams Admin Centre:**
1. Go to [admin.teams.microsoft.com](https://admin.teams.microsoft.com)
2. Navigate to **Teams apps → Manage apps**
3. Click **Upload new app** and select `VCU_IT_SelfHelp.zip`
4. Create or update an **App setup policy** to pin the app to the Teams rail for all staff

---

## Standalone Web Portal

The root-level files form a multi-page version of the portal suitable for an intranet or SharePoint site.

To deploy standalone:

1. Host all root-level HTML files, `css/`, `js/`, and `images/` at a web-accessible location
2. Point staff to `index.html`
3. Navigation links connect the pages (e.g. `passwords.html`, `network.html`)

No build step or back-end required.

---

## Customising Content

All portal content lives directly in the HTML.  Edit the files in any text editor or through GitHub — no CMS or database is involved.

### Adding or editing a help guide

Each guide is a `<div class="guide-card">` inside a `<div class="guides-grid">`.  Copy an existing card and update the content:

```html
<div class="guide-card" data-id="unique-kebab-id">
  <div class="guide-header">
    <div class="guide-title-area">
      <div class="guide-title">🔧 Brief title describing the problem</div>
      <div class="guide-tags">
        <!-- Available tags: tag-easy  tag-moderate  tag-call-it  tag-common -->
        <span class="guide-tag tag-easy">Easy Fix</span>
      </div>
    </div>
    <span class="guide-chevron" aria-hidden="true">▼</span>
  </div>
  <div class="guide-body">
    <div class="guide-content">
      <p class="guide-intro">One sentence explaining the situation.</p>
      <ol class="steps-list">
        <li>
          <span class="step-num">1</span>
          <span class="step-text">
            Step text. Use <strong>bold</strong> for UI labels and <code>Ctrl+X</code> for keyboard shortcuts.
          </span>
        </li>
        <!-- repeat <li> for each step -->
      </ol>
      <!-- Optional call-out boxes (add as many as needed): -->
      <div class="tip-box">
        <span class="box-icon">💡</span>
        <span>Helpful tip text here.</span>
      </div>
      <div class="warn-box">
        <span class="box-icon">⚠️</span>
        <span>Caution text here.</span>
      </div>
      <div class="call-box">
        <span class="box-icon">📞</span>
        <span>Describe when the user should stop and call IT instead.</span>
      </div>
    </div>
  </div>
</div>
```

### Adding a new category

1. Add a `<section class="category-section" id="cat-yourname">` block inside `#main-categories` in `index.html`
2. Add a nav link to `#cat-nav`:
   ```html
   <a href="#cat-yourname" class="cat-nav-link">🆕 Your Category</a>
   ```
3. Add a quick-link card to `#quick-links`:
   ```html
   <div class="quick-link-card" data-target="cat-yourname" role="button" tabindex="0">
     <span class="ql-icon">🆕</span>
     <span class="ql-label">Your Category</span>
   </div>
   ```
4. Update the `stat-num` in the hero section if you want the guide count to stay accurate

### Updating IT contact details

Search for `tburchell@valleycreditunion.com` and `pmoore@valleycreditunion.com` in `index.html` and replace with the current IT staff emails.  The contact block is inside `#call-it-section`:

```html
<div class="call-it-contact">
  <div class="contact-method">
    <span class="cm-icon">📧</span>
    <span>
      <span class="cm-label">Email (non-urgent)</span>
      <span class="cm-value">your.name@valleycreditunion.com</span>
    </span>
  </div>
</div>
```

### Showing the alert banner

To broadcast a known outage:

1. Update the text inside `<span id="alert-message">` in `index.html`
2. Add the following to the inline `<script>` at the bottom of `index.html`:
   ```js
   document.getElementById('alert-banner').classList.add('visible');
   ```

Remove the `visible` class (or remove the line) once the issue is resolved.

### Updating system-status entries

The System Status board is static HTML.  Find the relevant `<li class="status-item">` and change the CSS classes:

| Status | Indicator class | Label class | Label text |
|---|---|---|---|
| Operational | `status-ok` | `label-ok` | Operational |
| Degraded | `status-warn` | `label-warn` | Degraded |
| Outage | `status-down` | `label-down` | Outage |

Example — marking Email as degraded:
```html
<li class="status-item">
  <span class="status-indicator status-warn" aria-label="Degraded"></span>
  <span class="status-name">Email (Microsoft 365)</span>
  <span class="status-label label-warn">Degraded</span>
</li>
```

> In a future iteration, the status board can be driven by a JSON API.  The `initStatusBoard()` function in `main.js` contains a comment indicating where to add a `fetch()` call.

---

## Dark Mode & Theming

- The 🌙 / ☀️ toggle in the header switches between dark and light mode
- The preference is persisted in `localStorage` under the key `theme` (`"dark"` or `"light"`)
- On first load the portal matches the user's OS colour-scheme preference (`prefers-color-scheme: dark`)
- All colours are CSS custom properties — to rebrand, edit the `:root` block at the top of the `<style>` section in `index.html`:

```css
:root {
  --navy:     #1a3a5c;   /* primary brand colour */
  --seafoam:  #4a9e8e;   /* accent colour */
  --gold:     #c8922a;   /* highlights / CTA */
  /* ... */
}
```

---

## File Reference

### `VCU_IT_Self_Help_Complete_Teams_App/manifest.json`

The Teams app manifest.  Key fields:

| Field | Purpose |
|---|---|
| `id` | Unique GUID for this Teams app — generate a new one before deploying |
| `version` | Increment (e.g. `"1.0.1"`) whenever you update the manifest |
| `developer.websiteUrl` | Must be a live HTTPS URL — used by Teams validation |
| `developer.privacyUrl` | HTTPS link to a privacy statement |
| `developer.termsOfUseUrl` | HTTPS link to terms of use |
| `staticTabs[0].contentUrl` | Full HTTPS URL to `index.html` on your host |
| `staticTabs[0].websiteUrl` | Same URL — shown as the "Open in browser" link in Teams |
| `validDomains` | Array of hostnames the tab content is served from |

### `VCU_IT_Self_Help_Complete_Teams_App/js/main.js`

All interactive behaviour is handled in a single IIFE (Immediately Invoked Function Expression):

| Function | Responsibility |
|---|---|
| `buildSearchIndex()` | Scrapes guide card titles, intro text and steps into an in-memory search index after page load |
| `doSearch(query)` | Filters the index, renders highlighted result cards, and hides/shows the main category grid |
| `initAccordions()` | Expands/collapses guide cards on click or Enter/Space keyboard press; sets ARIA `aria-expanded` |
| `initQuickLinks()` | Smooth-scrolls to category sections from the quick-link grid and auto-opens the first guide card |
| `initThemeToggle()` | Dark/light mode toggle with `localStorage` persistence and OS preference detection |
| `initBackToTop()` | Shows/hides the floating back-to-top button based on scroll position |
| `initAlertBanner()` | Dismisses the alert banner when the close button is clicked |
| `initStatusBoard()` | Sets the "last checked" timestamp on the status board |
| `initMobileSearchScroll()` | Scrolls to the top of the page when the search input is focused on small screens |

### Icon files

Teams requires two icon files in every app package:

| File | Dimensions | Use |
|---|---|---|
| `color-icon.png` | 192×192 px — full colour | Shown in the Teams app store, launcher and admin centre |
| `outline-icon.png` | 32×32 px — white on transparent | Shown in the Teams sidebar rail when the app is pinned |

Replace these with your own branded icons before publishing to the org app catalogue.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic, WCAG-accessible) |
| Styling | CSS3 — custom properties, Grid, Flexbox (no framework) |
| Scripting | Vanilla JavaScript ES5+ (no frameworks, no build tools, no dependencies) |
| Teams integration | [Microsoft Teams JS SDK v2](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/using-teams-client-sdk) loaded from Microsoft CDN |
| Icons | Unicode emoji (no icon-font dependencies) |
| Hosting | Any static file host — Azure Static Web Apps, SharePoint, IIS, nginx, GitHub Pages, Cloudflare Pages, etc. |

---

## IT Contacts

| Name | Email |
|---|---|
| Tyler Burchell | tburchell@valleycreditunion.com |
| P. Moore | pmoore@valleycreditunion.com |

**Teams channel:** IT Support
**Hours:** Monday – Friday, 8:30 am – 4:30 pm

---

*For internal staff use only · © Valley Credit Union*
