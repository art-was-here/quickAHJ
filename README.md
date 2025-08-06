# Quick AHJ Search Chrome Extension

A Chrome extension for quickly searching Authority Having Jurisdiction (AHJ) information for addresses using the AHJ Registry API.

## Features

- 🎨 **System Theme Support**: Automatically follows your system's dark/light theme preference
- 🔍 **Address Autocomplete**: Real-time address suggestions as you type
- 🏛️ **Comprehensive AHJ Data**: Retrieves detailed jurisdiction, permit, and inspection information
- ⚡ **Utility Information**: Provides utility company and interconnection details
- 🔧 **Custom API Key**: Option to use your own AHJ Registry API key
- 📱 **Responsive Design**: Clean, modern interface that works seamlessly

## Installation

### Option 1: Manual Installation (Development)

1. **Download/Clone the Extension**
   ```bash
   git clone <repository-url>
   cd quick-ahj
   ```

2. **Create Icon Files** (Required for Chrome)
   
   Since Chrome requires PNG icons, you need to convert the provided SVG to PNG format:
   
   - Convert `icons/icon.svg` to PNG files:
     - `icons/icon16.png` (16x16 pixels)
     - `icons/icon48.png` (48x48 pixels) 
     - `icons/icon128.png` (128x128 pixels)
   
   You can use online converters or tools like ImageMagick:
   ```bash
   # If you have ImageMagick installed
   convert icons/icon.svg -resize 16x16 icons/icon16.png
   convert icons/icon.svg -resize 48x48 icons/icon48.png
   convert icons/icon.svg -resize 128x128 icons/icon128.png
   ```

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `quick-ahj` folder

### Option 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store once published.

## Usage

### Basic Search

1. **Open the Extension**
   - Click the extension icon in the Chrome toolbar
   - Or use the keyboard shortcut (if configured)

2. **Enter an Address**
   - Type an address in the search field
   - Address suggestions will appear as you type
   - Click on a suggestion or continue typing

3. **Search AHJ Information**
   - Click the "Submit" button
   - Wait for the results to load

4. **View Results**
   - Comprehensive AHJ information will be displayed
   - Includes contact info, permits, inspections, and utility details
   - Click "Clear" to return to the search screen

### Settings Configuration

1. **Open Settings**
   - Click the "Settings" button in the main interface
   - Or right-click the extension icon and select "Options"

2. **Configure API Key** (Optional)
   - Enter your AHJ Registry API key if you have one
   - Leave blank to use the default key (with rate limitations)
   - Click "Save Settings"

## API Information

This extension uses the AHJ Registry API from:
- **API Documentation**: [https://ahjregistry.myorangebutton.com/#/APIDoc](https://ahjregistry.myorangebutton.com/#/APIDoc)
- **Address Geocoding**: OpenStreetMap Nominatim API

### Demo Mode

Currently, the extension runs in demo mode with realistic mock data since the actual AHJ Registry API requires authentication. To enable the real API:

1. Obtain an API key from the AHJ Registry
2. Update the API endpoints in `popup.js`
3. Uncomment the actual API call code

## Data Provided

The extension retrieves and displays:

### 📍 Address Information
- Full address with coordinates
- City, county, state, and ZIP code

### 🏛️ Authority Having Jurisdiction (AHJ)
- Jurisdiction name and type
- Authority type (Building Department, etc.)
- Complete contact information

### 📋 Permit Requirements
- Electrical, building, and fire permit requirements
- Estimated review times
- Permit fees

### 🔍 Inspection Requirements
- Required inspection types
- Special requirements and restrictions

### ⚡ Utility Information
- Utility company details
- Interconnection process information
- Contact details and timelines

### 📝 Additional Notes
- Historic district restrictions
- HOA requirements
- State incentives information

## Technical Details

### Built With
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No external dependencies
- **CSS Custom Properties**: Theme-aware styling
- **Chrome Storage API**: Settings persistence

### Browser Support
- Chrome 88+ (Manifest V3 support required)
- Chromium-based browsers (Edge, Brave, etc.)

### Permissions
- `storage`: For saving user settings
- `activeTab`: For extension popup functionality
- Host permissions for:
  - AHJ Registry API
  - OpenStreetMap Nominatim (address suggestions)

## Development

### File Structure
```
quick-ahj/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── popup.js               # Main functionality
├── settings.html          # Settings page
├── settings.js            # Settings functionality
├── styles.css             # Theme-aware styles
├── icons/                 # Extension icons
│   ├── icon.svg          # Source SVG icon
│   ├── icon16.png        # 16x16 icon (required)
│   ├── icon48.png        # 48x48 icon (required)
│   └── icon128.png       # 128x128 icon (required)
└── README.md             # This file
```

### Key Features Implementation

1. **Theme Support**: Uses CSS `prefers-color-scheme` media queries
2. **Address Suggestions**: Debounced API calls to Nominatim
3. **Keyboard Navigation**: Arrow keys and Enter support for suggestions
4. **Error Handling**: Comprehensive error messaging
5. **Loading States**: Visual feedback during API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or feature requests:
- Create an issue on GitHub
- Check the AHJ Registry API documentation
- Review Chrome extension development guidelines

## Disclaimer

This extension is not affiliated with the official AHJ Registry. It's a third-party tool designed to make AHJ information more accessible. Always verify information with the relevant authorities before proceeding with permits or installations. 