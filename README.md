# K Explore

A responsive event management website for campus events. Browse upcoming events, search and filter them, read the details and register for a ticket. Built with plain HTML5, CSS3 and JavaScript. No framework and no build step.

**Live site:** aamirquraishi.github.io/k-explore/

## Design idea: a risograph print shop

Most event sites look the same: a gradient hero, rounded cards and a soft shadow. K Explore borrows from risograph posters instead, the cheap two-ink prints you see on gig flyers and student zines.

- **Misregistered hero.** The headline is printed in three inks. Pink and yellow plates sit slightly off the blue one, so they overprint into new colours. On load the plates slide into place, and afterwards they drift with your pointer.
- **Tickets, not cards.** Every event is a ticket with a torn stub, notched edges and a seat meter that fills as people register.
- **Generated posters.** Each event gets its own poster, drawn as SVG from the event id, so no image files are needed. Every category has its own ink (Tech is blue, Music is pink, Culture is orange, Sports is teal, Workshop is yellow).
- **Hard shadows and heavy outlines.** Flat offset shadows press in when you click, like a physical button.
- **Paper grain** over the whole page, plus a dark theme where the inks switch from multiply to screen blending.

Typefaces: Bricolage Grotesque (a condensed, heavy setting for display) and Instrument Sans for body text, loaded from Google Fonts.

## Features

| Requirement | Where it lives |
| --- | --- |
| Hero section | Overprint headline, live countdown to the next event |
| Upcoming and featured events | "Headliners" poster wall, plus the full grid |
| Event cards (name, date, venue, image, description) | `ticketHTML()` in `js/app.js` |
| Browse, search, filter by category | Search box, category chips and sort menu |
| Event detail view | Dialog with description, schedule, countdown and seats |
| Registration form (name, email, phone, event) | Second view in the same dialog |
| JavaScript validation | `rules` object: name, email, Indian mobile number, event, ID checkbox. Errors show on blur and on submit, and focus jumps to the first bad field |
| Confirmation message | Ticket with a generated ID and barcode |
| Responsive | Checked at 390 px, 820 px and 1440 px |

**Bonus challenges**

- Dark and light mode. It follows the system setting first, then remembers your choice.
- Countdown timers in the hero and in every event dialog.
- Animations: the hero plates, a stamp-in for the confirmation ticket and a pop when filters change. All are switched off for people who prefer reduced motion.
- Local Storage registrations. Tickets persist, seat counts update, duplicate registrations are blocked and tickets can be cancelled from "My tickets".

**Details worth noting**

- Event dates are set relative to today, so the demo never goes stale.
- Dialogs use the native `<dialog>` element, which gives focus trapping and Escape-to-close for free.
- Events are deep-linkable, for example `index.html#event=hack-the-quad`.
- Keyboard focus is visible everywhere, and the cards are real buttons under the hood.

## Project structure

```
index.html        page structure
css/style.css     design tokens, layout, components
js/data.js        the twelve demo events
js/app.js         rendering, filters, dialogs, validation, storage
```

## Run it locally

No install needed. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploy

**GitHub Pages:** push the repo, then go to Settings, Pages, choose the `main` branch and the root folder.

**Netlify or Vercel:** import the GitHub repo. No build command, and the publish directory is the repo root.

## Research and inspiration

I looked at Awwwards' brutalist and typographic sites, festival site roundups and 2026 design trend write-ups. The ideas I kept were tactile, high-contrast type, visible structure (outlines and hard shadows), and one memorable interaction instead of many small ones.

## Notes

All events, venues and seat numbers are made-up demo data. Registration details are stored only in the visitor's browser.
