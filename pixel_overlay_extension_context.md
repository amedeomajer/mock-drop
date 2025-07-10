# Chrome Extension: Pixel-Perfect Image Overlay Tool (Context Document)

## 1. Project Overview

This project is a Chrome Extension that allows users to upload one or more image files (e.g. PNG, JPEG) and overlay them on any webpage. The primary goal is to help front-end developers achieve **pixel-perfect** layouts by visually comparing a live webpage against design mockups placed on top. By rendering design images as semi-transparent layers over the site, developers can easily spot misalignments or style differences. This document serves as a detailed context and specification to guide the Cursor AI in generating the extension’s code from start to finish, following best practices for context-driven development.

## 2. Core Features and Functionalities

### Image Upload & Overlay

- Upload one or multiple design images via file picker or drag-and-drop.
- Images are added as absolutely positioned `<img>` layers on top of webpage content.
- Support concurrent overlays.

### Drag & Position

- Draggable with the mouse.
- Arrow keys nudge the selected image by 1px (10px with Shift).

### Opacity Control

- Adjustable opacity per image (0%–100%) via slider or input.

### Rotation

- Rotate images via buttons or degree input (0–360°).

### Flip Controls

- Flip images horizontally and/or vertically via buttons.

### Control Panel

- Persistent floating panel injected into the page DOM.
- Remains functional until explicitly closed.
- Can be minimized to a compact state.
- Includes all controls listed above plus:
  - Reset/Clear All Images
  - Help/Instructions

## 3. Technical Architecture

### Manifest V3

- Uses Chrome Extension Manifest v3.
- Content scripts handle DOM interaction.
- No need for background workers.

### Content Script & DOM Injection

- Injects overlay images and panel into the page DOM.
- Uses vanilla JS for DOM manipulation.

### Panel UI

- Implemented as injected DOM or iframe panel.
- Stays open and interactive.
- Not a browser popup.

### CSS Isolation

- Uses Shadow DOM or iframe to prevent style clashes.
- Scoped CSS to avoid leaking styles.

### Event Handling

- Mouse events for dragging overlays.
- Keyboard events for arrow key positioning.
- Input events for opacity, rotation.
- Click events for flip, reset, and upload.

### State Persistence

- `chrome.storage.local` or `localStorage` used.
- Remembers overlay state, panel state, and user preferences.

## 4. Suggested File Structure

```
my-extension/
├── manifest.json               # Manifest V3 config
├── popup.html                  # HTML for panel UI (if iframe is used)
├── popup.js                    # JS for panel controls
├── content.js                  # Injects overlays and UI
├── styles/
│   └── popup.css               # Scoped styles for panel UI
├── assets/                     # Icons and image assets
└── utils/
    └── imageHelpers.js         # DOM/image helper functions
```

## 5. Testing Strategy

### Cross-Page Testing

- Static and dynamic sites (React, Vue, etc).

### Non-intrusiveness

- Confirm DOM-safe injections.
- No interference with native site elements.

### Interaction Testing

- Drag/Drop behavior is smooth.
- Keyboard navigation behaves predictably.
- UI controls respond and update overlays in real-time.

### Performance

- Lightweight, responsive UI.
- Clean unload on page refresh.

### Edge Cases

- Large images, many images.
- Combination of flips/rotations.
- Z-index testing.

## 6. UX Considerations

### Non-Intrusive UI

- Minimal, repositionable floating panel.
- Collapsible/minimizable interface.

### Intuitive Controls

- Clear icons, tooltips, and text labels.
- Keyboard shortcuts for power users.
- Live preview on changes.

### State Persistence

- Overlay state per domain/page.
- Remember last used settings.
- Option to clear/reset.

---

*This context is optimized for Cursor to generate a complete Chrome extension using vanilla JS, HTML, and CSS that enables developers to overlay and manipulate design images on top of webpages for pixel-perfect implementation.*

