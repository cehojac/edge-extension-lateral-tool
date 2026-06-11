# Edge Sidebar Productivity Extension

This extension restores the sidebar toolbar functionality that Microsoft removed from Edge, providing customizable productivity tools with a modern design inspired by Edge's interface.

## ✨ Features

### Productivity Tools
- **🧮 Calculator**: Basic calculator with arithmetic operations (+, -, *, /)
- **✓ Todo List**: Todo list with checkboxes and automatic persistence
- **🌐 Translator**: Integrated translator using Microsoft Edge API with support for 40+ languages
- **📝 Quick Notes**: Simple notepad with auto-save
- **⏱️ Timer**: Digital clock with configurable timer
- **🔗 Shortcuts**: Custom links to favorite websites with favicon support

### Modern User Experience
- **🎨 Edge-Inspired Design**: Modern interface that seamlessly integrates with Microsoft Edge
- **🌓 Smart Themes**: Support for light, dark, and automatic system theme
- **🔄 Drag-and-Drop**: Reorganize tools by dragging with smooth animations
- **💾 Persistence**: All data automatically saved to chrome.storage.local
- **⚡ Smooth Transitions**: Smooth animations with cubic-bezier for a premium experience
- **♿ Accessibility**: Visible focus states, 44px touch targets, WCAG AA contrast
- **📱 Responsive**: Design that adapts to different screen sizes
- **🔄 Real-time Updates**: System theme automatically updates when you change your OS settings
- **🌍 Internationalization**: Automatic language detection (English/Spanish) based on system language

### Microsoft Edge Translator
- **Native API**: Uses the Translator API integrated in Microsoft Edge (version 148+)
- **40+ Languages**: Support for Spanish, English, French, German, Japanese, Chinese, and more
- **Auto Detection**: Automatically detects source language
- **Cost-Free**: Local translation without cloud services
- **Privacy**: Data never leaves your device
- **Offline**: Works without connection once model is downloaded
- **📋 Copy Functionality**: One-click copy of translation results
- **⚡ Real-time Translation**: Automatic translation while typing (500ms debounce)

## Installation

### 1. Generate Icons

Before installing the extension, you need to generate the icons:

1. Open the `generate-icons.html` file in your browser
2. Click "Generate and Download Icons"
3. Move the downloaded files (icon16.png, icon48.png, icon128.png) to the `icons` folder

### 2. Load the Extension in Edge

1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked"
5. Select the `sidebar-productivity` folder
6. The extension will be installed and appear in the toolbar

## Usage

### Opening the Sidebar

- Click the extension icon in the Edge toolbar
- The sidebar will open on the right side of the browser

### Configuring Tools

1. Click the settings icon (⚙️) in the sidebar
2. The settings page will open
3. Change the theme:
   - **System**: Automatically follows your operating system's theme
   - **Light**: Force light mode
   - **Dark**: Force dark mode
4. Enable/disable individual tools
5. Click "Save"

**Note about system theme**: When you select "System", the extension will automatically detect if your operating system is in light or dark mode and adjust accordingly. If you change your system theme while the extension is open, it will update automatically.

### Organizing Tools

- Drag tools to reorganize them
- Click on a tool's header to expand/collapse it

### Using the Tools

**Calculator:**
- Use the buttons to perform calculations
- Supports basic operations (+, -, *, /)

**Todo List:**
- Type a task and press Enter or click "Add"
- Mark tasks as complete with the checkbox
- Delete tasks with the X button

**Quick Notes:**
- Type your notes in the text area
- They save automatically while you type

**Timer:**
- Enter hours, minutes, and seconds
- Click "Start" to begin
- Use "Pause" and "Reset" as needed

**Shortcuts:**
- Add name and URL of websites
- Click shortcuts to open them in new tabs
- Delete shortcuts with the X button
- Shortcuts automatically display website favicons

**Translator:**
- Select source language (or "Detect language" for automatic detection)
- Select target language
- Type the text you want to translate
- **Translation will appear automatically while you type** (with 500ms debounce)
- You can also click "Translate" or press Enter to translate manually
- Translation updates automatically when you change languages
- Use the swap button (↔️) to quickly switch languages
- Click the copy button to copy the translation result

**Note**: The translator requires Microsoft Edge version 148 or higher. The first time you use a language pair, the model will download automatically. The translator works locally and doesn't require internet connection after the initial download.

## Storage

All data is saved locally in your browser using `chrome.storage.local`:
- Tool configuration (order, visibility)
- Tool data (tasks, notes, shortcuts)
- User preferences (theme: system/light/dark)

To clear all data:
1. Open settings
2. Click "Clear all data"
3. Confirm the action

## Compatibility

### Compatible Browsers
- **Microsoft Edge** (version 148+ for full translator support)
- **Google Chrome** (without translator - Translator API is Edge exclusive)
- **Brave** (without translator)
- **Opera** (without translator)
- **Other Chromium-based browsers** (without translator)

### Compatibility Notes
- The **Translator** only works in Microsoft Edge version 148 or higher, as it uses Edge's native Translator API
- In other browsers, the translator will show a message indicating the API is not available
- Other tools work in all Chromium browsers
- Microsoft Edge is recommended for the full experience

## File Structure

```
sidebar-productivity/
├── manifest.json              # Extension configuration
├── background.js              # Service worker
├── sidebar.html               # Sidebar interface
├── sidebar.css                # Sidebar styles (modern design)
├── sidebar.js                 # Sidebar logic + translator
├── popup.html                 # Settings page
├── popup.css                  # Settings styles (modern design)
├── popup.js                   # Settings logic
├── _locales/                  # Internationalization files
│   ├── en/                    # English translations
│   └── es/                    # Spanish translations
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon.svg
│   └── README.md
├── generate-icons.py          # Icon generator (Python)
├── generate-icons.html        # Icon generator (HTML)
├── create-simple-icons.html   # Simplified icon generator
├── generate-icons.bat         # Windows batch script
├── generate-icons.ps1         # PowerShell script
└── README.md                  # This file
```

## Development

### Required Permissions

- `sidePanel`: To display the sidebar
- `storage`: To save data locally
- `unlimitedStorage`: For unlimited storage

### APIs Used

- `chrome.sidePanel`: Sidebar API
- `chrome.storage.local`: Local storage
- `chrome.runtime`: Messaging between contexts
- `chrome.i18n`: Internationalization API

## License

This extension is open source and available for personal and commercial use.

## Author

Created and developed by [cehojac](https://github.com/cehojac).

## Support the Project

If you find this extension useful, consider supporting its development:

[![Buy me a coffee](https://www.buymeacoffee.com/assets/img/guidelines/download-assets/buttons-orange/bmc-logo.svg)](https://www.buymeacoffee.com/PfYvexH)

## Support

If you encounter any issues or have suggestions, please report the issue in the project repository.