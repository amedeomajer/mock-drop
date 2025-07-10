# MockDrop image overlay

A ⚠️ Vibe Coded ⚠️ Chrome Extension that allows developers to overlay design images on webpages for pixel-perfect layout comparison. Perfect for comparing live websites with design mockups!

## Features

### 🎯 Core Functionality

- **Image Upload**: Upload multiple design images via file picker or drag-and-drop
- **Overlay Positioning**: Drag images to position them precisely over webpage content
- **Opacity Control**: Adjust transparency from 0% to 100% with slider or input
- **Rotation**: Rotate images by degree or use quick rotation buttons
- **Flip Controls**: Flip images horizontally and/or vertically
- **Keyboard Navigation**: Use arrow keys for precise 1px positioning (10px with Shift)

### 🎨 User Interface

- **Floating Control Panel**: Persistent, draggable panel that stays open
- **Minimizable Interface**: Collapse panel to save screen space
- **Image Thumbnails**: Visual preview of uploaded overlays
- **Real-time Controls**: Live preview of all adjustments
- **State Persistence**: Remembers overlay positions and settings per page

### ⚡ Technical Features

- **Manifest V3**: Built with latest Chrome Extension standards
- **Non-intrusive**: Doesn't interfere with webpage functionality
- **Cross-page Support**: Works on any website (static and dynamic)
- **Performance Optimized**: Lightweight and responsive
- **Storage**: Saves state using Chrome's local storage

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store (Coming Soon)

_This extension will be available on the Chrome Web Store soon for easy installation._

## Usage

### Getting Started

1. **Navigate** to any webpage you want to compare with your design
2. **Click the extension icon** in your Chrome toolbar
3. **Click "Activate Overlay Tool"** to start the overlay system
4. **Upload your design images** using the floating panel

### Uploading Images

- **File Picker**: Click "Upload Images" to select files from your computer
- **Drag & Drop**: Drag image files directly onto the drop zone
- **Supported Formats**: PNG, JPEG, GIF, WebP, SVG
- **File Size Limit**: Up to 10MB per image

### Controlling Overlays

#### Selection

- **Click** on any overlay to select it
- **Selected overlays** are highlighted in the panel

#### Positioning

- **Drag** overlays with your mouse to reposition
- **Arrow Keys**: Move selected overlay by 1px
- **Shift + Arrow Keys**: Move selected overlay by 10px
- **Position Buttons**: Use the arrow buttons in the panel

#### Adjustments

- **Opacity Slider**: Adjust transparency from 0% to 100%
- **Rotation Input**: Set exact rotation angle (0-360°)
- **Rotation Buttons**: Quick 90° rotation left/right
- **Flip Buttons**: Flip horizontally (↔) or vertically (↕)

#### Management

- **Delete Selected**: Remove the currently selected overlay
- **Reset All**: Remove all overlays from the page
- **Help**: View keyboard shortcuts and instructions

### Keyboard Shortcuts

| Shortcut                | Action                        |
| ----------------------- | ----------------------------- |
| `←` `→` `↑` `↓`         | Move selected overlay by 1px  |
| `Shift + ←` `→` `↑` `↓` | Move selected overlay by 10px |
| `Delete` / `Backspace`  | Delete selected overlay       |

### Panel Controls

- **Minimize (−)**: Collapse the panel to save space
- **Close (×)**: Hide the panel (reopen via extension icon)
- **Drag Header**: Reposition the entire panel

## File Structure

```
web-image-overlay/
├── manifest.json              # Extension configuration
├── content.js                 # Main overlay functionality
├── popup.html                 # Extension popup interface
├── popup.js                   # Popup script logic
├── styles/
│   ├── popup.css             # Popup styling
│   └── content.css           # Content script styling
├── utils/
│   └── imageHelpers.js       # Image utility functions
├── icons/                    # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md                 # This file
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

1. **Clone** the repository
2. **Load** as unpacked extension in Chrome
3. **Make changes** to the code
4. **Reload** the extension in `chrome://extensions/`
5. **Refresh** the webpage to see changes

### Building for Production

1. **Test thoroughly** on various websites
2. **Update version** in `manifest.json`
3. **Zip** the extension folder
4. **Submit** to Chrome Web Store (if publishing)

## Browser Compatibility

- ✅ Chrome 88+ (Manifest V3)
- ✅ Edge 88+ (Chromium-based)
- ❌ Firefox (requires Manifest V2 conversion)
- ❌ Safari (requires different extension format)

## Troubleshooting

### Common Issues

**Extension not working on a website:**

- Check if the site has strict Content Security Policy (CSP)
- Try refreshing the page after activating the tool
- Ensure the extension has necessary permissions

**Images not uploading:**

- Verify file format is supported (PNG, JPEG, GIF, WebP, SVG)
- Check file size is under 10MB
- Try a different image file

**Panel not appearing:**

- Click the extension icon and activate the tool
- Check if the panel is minimized or moved off-screen
- Refresh the page and try again

**Overlays not draggable:**

- Ensure you've selected an overlay first
- Check if the page has interfering JavaScript
- Try clicking on the overlay to select it

### Getting Help

If you encounter issues:

1. **Check the browser console** for error messages
2. **Refresh the page** and try again
3. **Disable other extensions** that might interfere
4. **Report issues** on the project repository

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Guidelines

- Follow existing code style and structure
- Test on multiple websites before submitting
- Update documentation for new features
- Ensure compatibility with Manifest V3

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for front-end developers and designers
- Inspired by the need for pixel-perfect layout comparison
- Uses modern web technologies and Chrome Extension APIs

---

**Happy pixel-perfect development! 🎨✨**
