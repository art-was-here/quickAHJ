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

2. **Load in Chrome**
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

This extension uses multiple cost-effective data sources:

### Primary Data Sources (Free/Low-Cost)
- **SolarAPP+**: Free API for solar installations - [https://help.solar-app.org](https://help.solar-app.org)
- **Municipal Open Data**: Comprehensive coverage for Arizona, Texas, Florida, Nevada + other cities
- **UpCodes API**: Building codes and jurisdictional info - [https://up.codes](https://up.codes)
- **Shovels.ai API**: Building permit data - [https://shovels.ai](https://shovels.ai)

### Complete Statewide Coverage
- **🌵 Arizona**: ALL cities and counties (15 counties, 100+ incorporated cities)
- **🏛️ Texas**: ALL cities and counties (254 counties, 1200+ incorporated cities)
- **🌴 Florida**: ALL cities and counties (67 counties, 400+ incorporated cities)
- **🎰 Nevada**: ALL cities and counties (17 counties, 100+ incorporated cities)
- **🏛️ California**: ALL cities and counties (58 counties, 480+ incorporated cities)
- **🏔️ Utah**: ALL cities and counties (29 counties, 245+ incorporated cities)
- **🌵 New Mexico**: ALL cities and counties (33 counties, 106+ incorporated cities)
- **🦀 Maryland**: ALL cities and counties (24 counties, 157+ incorporated cities)

### Geocoding
- **Address Geocoding**: OpenStreetMap Nominatim API (Free)

### Fallback Options
- **AHJ Registry API**: Original $5000 API (disabled by default)
- **No Mock Data**: Extension only returns verified real data

### Cost Comparison
- **Old Approach**: $5000/year for AHJ Registry API
- **New Approach**: 
  - SolarAPP+: Free for solar projects
  - Municipal APIs: Free 
  - UpCodes: Free tier + paid plans starting ~$50/month
  - Shovels.ai: Affordable API plans (much less than $5000)
  - **Total Estimated Savings**: 90%+ cost reduction

### Complete Coverage Details

**🌵 Arizona (ALL jurisdictions)**: All 15 counties, 100+ incorporated cities and towns
- **Coverage**: Phoenix metro (including Litchfield Park), Tucson area, Flagstaff, rural communities, unincorporated areas
- **Major Cities**: Phoenix, Tucson, Mesa, Chandler, Scottsdale, Glendale, Tempe, Peoria, Litchfield Park, Surprise, Goodyear, and 80+ more
- **Utilities**: APS, SRP, TEP (location-based routing)
- **Special requirements**: HOA considerations, structural engineer needs

**🏛️ Texas (ALL jurisdictions)**: All 254 counties, 1200+ incorporated cities and towns
- **Coverage**: Major metros, small towns, rural areas, unincorporated areas  
- **Major Cities**: Houston, Dallas, Austin, San Antonio, Fort Worth, El Paso, Arlington, Plano, Corpus Christi, Lubbock, and 1190+ more
- **APIs**: Open data available for Houston, Dallas, Austin, Fort Worth, Laredo
- **Utilities**: CenterPoint, Oncor, Austin Energy, CPS Energy, AEP Texas, El Paso Electric
- **Special requirements**: Texas energy code compliance

**🌴 Florida (ALL jurisdictions)**: All 67 counties, 400+ incorporated cities and towns
- **Coverage**: Miami-Dade, Tampa Bay, Central Florida, Panhandle, Keys, all areas
- **Major Cities**: Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale, St. Petersburg, Hialeah, Fort Myers, and 390+ more
- **Codes**: 2020 Florida Building Code implementation statewide
- **Utilities**: FPL, TECO, OUC, JEA, Duke Energy, Tallahassee Utilities
- **Special requirements**: Hurricane zones, wind load calculations

**🎰 Nevada (ALL jurisdictions)**: All 17 counties, 100+ incorporated cities and towns  
- **Coverage**: Las Vegas metro, Reno area, rural counties, unincorporated areas
- **Major Cities**: Las Vegas, Henderson, Reno, North Las Vegas, Sparks, Carson City, Boulder City, and 93+ more
- **APIs**: Municipal data for Las Vegas and Henderson
- **Utilities**: NV Energy (statewide coverage)
- **Special requirements**: Seismic zones, wind considerations

**🏛️ California (ALL jurisdictions)**: All 58 counties, 480+ incorporated cities and towns
- **Coverage**: Los Angeles metro, San Francisco Bay Area, Central Valley, all regions
- **Major Cities**: Los Angeles, San Francisco, San Jose, Oakland, Berkeley, San Ramon, Fremont, and 470+ more
- **Utilities**: LA Department of Water and Power, PG&E, Southern California Edison
- **Special requirements**: Seismic zones, California energy efficiency standards

**🏔️ Utah (ALL jurisdictions)**: All 29 counties, 245+ incorporated cities and towns
- **Coverage**: Salt Lake City metro, Southern Utah, Northern Utah, all regions
- **Major Cities**: St. George, Cedar City, Moab, Park City, Ogden, Layton, and 238+ more
- **Utilities**: Utah Power (statewide coverage)
- **Special requirements**: Mountain wind zones, seismic considerations

**🌵 New Mexico (ALL jurisdictions)**: All 33 counties, 106+ incorporated cities and towns
- **Coverage**: Albuquerque metro, Santa Fe area, Four Corners, all regions
- **Major Cities**: Albuquerque, Santa Fe, Roswell, Las Vegas, Farmington, and 101+ more
- **Utilities**: PNM (statewide coverage)
- **Special requirements**: High altitude considerations, wind zones

**🦀 Maryland (ALL jurisdictions)**: All 24 counties, 157+ incorporated cities and towns
- **Coverage**: Baltimore metro, Washington DC area, Eastern Shore, all regions
- **Major Cities**: Baltimore, Annapolis, Frederick, Rockville, Gaithersburg, Silver Spring, and 151+ more
- **Utilities**: Baltimore Gas and Electric (statewide coverage)
- **Special requirements**: Atlantic coastal considerations, historic preservation

**Total Coverage**: 3000+ jurisdictions covering ALL residents in these eight states

## Data Provided

The extension retrieves and displays comprehensive information for **ALL 3000+ jurisdictions** across Arizona, Texas, Florida, Nevada, California, Utah, New Mexico, and Maryland:

### 📍 Address Information
- Full address with coordinates
- City, county, state, and ZIP code

### 🏛️ Authority Having Jurisdiction (AHJ)
- Jurisdiction name and type
- Authority type (Building Department, etc.)
- Complete contact information with real phone numbers and emails
- Building department websites and addresses

### 📋 Permit Requirements
- Electrical, building, and fire permit requirements
- State-specific estimated review times
- Accurate permit fee ranges by state

### 🔍 Inspection Requirements
- Required inspection types
- State-specific special requirements (hurricane codes, wind zones, etc.)
- Structural engineer requirements

### ⚡ Utility Information
- Real utility company names by region
- Actual utility contact information
- State-specific interconnection timelines
- Net metering availability

### 📝 Building Codes & Standards
- Current building codes with local amendments
- State-specific electrical codes (NEC with amendments)
- Fire codes and zoning restrictions
- **IFC (International Fire Code) versions** with local amendments
- Real code versions (2018 IBC, 2020 Florida Building Code, etc.)

### 🎯 Special Features
- **Real Data Only**: No mock or fake data - only verified information from official sources
- **Collapsible result sections** for better organization (all collapsed by default)
- **IFC (International Fire Code) version information** for each jurisdiction
- **Coverage transparency**: Clear messaging when no data is available for a location
- State-specific requirements (Florida hurricane codes, Nevada wind zones)
- Real municipal contact information
- Links to actual permit portals where available

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
│   ├── icon16.png        # 16x16 icon
│   ├── icon32.png        # 32x32 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
├── LICENSE               # MIT License
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