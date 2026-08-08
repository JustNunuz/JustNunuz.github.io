# Threat Map Page Improvements

## Goal
Make the threat map feel more alive, useful, and polished on both desktop and mobile while keeping the existing data pipeline intact.

## Proposed Changes

### 1. Map Interactivity
- Clicking a map marker filters the indicator list to that country (same behaviour as the Top Origins bars).
- Clicking the active marker again clears the country filter.
- Hovering a marker highlights the matching row in the indicator list.

### 2. Mobile Layout Fix
- Convert the map section to a stacked layout on small screens: map first, then the detail tooltip below it instead of overlapping.
- Move the mobile legend above the map so it does not overlap the chart area.
- Ensure the indicator list remains readable down to 360 px wide viewports.

### 3. Operational Actions
- Add an "Export blocklist" button that downloads the currently visible IPs/domains as a plain text file.
- Add a copy-to-clipboard button on each indicator row for the full IP:port value.

### 4. Time Dimension
- Add a small hourly sparkline or bar chart showing indicators seen per hour over the last 24 hours, using the `perHour` data already returned by the edge function.
- Animate new rows briefly when the silent 5-minute refresh pulls fresh data.

### 5. Visual Polish
- Replace plain dots with subtle pulse rings for indicators first seen within the last 24 hours.
- Add a faint connecting line from the active marker to the detail card so the relationship is obvious.
- Use consistent HUD styling for the legend and detail card.

### 6. Southern Africa Focus
- Add a dedicated "Southern Africa" stats card alongside the existing Africa card.
- Surface any Zimbabwe-hosted indicators in the detail card copy if present.

### 7. Robustness
- Stabilise React keys for markers and list rows using a hash of IP + kind + source instead of array index.
- Show a clearer empty state when all feeds fail.

## Out of Scope
- Adding new backend feeds or changing the cache TTL.
- Rewriting the briefing/glossary copy unless requested.

## Files to Edit
- `src/pages/ThreatMap.tsx` — UI, interactions, responsive layout, export/copy actions.
- `src/index.css` — optional utility classes for pulse rings and animated rows if needed.
