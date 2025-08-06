// Main popup functionality
class QuickAHJSearch {
    constructor() {
        this.init();
        this.defaultApiKey = 'demo-key'; // Default API key for demo purposes
        this.currentSuggestions = [];
        this.selectedAddress = null;
    }

    async init() {
        this.setupEventListeners();
        this.loadSettings();
    }

    setupEventListeners() {
        // Main UI elements
        const addressInput = document.getElementById('address-input');
        const submitBtn = document.getElementById('submit-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const clearBtn = document.getElementById('clear-btn');

        // Input events for address suggestions
        addressInput.addEventListener('input', this.handleAddressInput.bind(this));
        addressInput.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Button events
        submitBtn.addEventListener('click', this.handleSubmit.bind(this));
        settingsBtn.addEventListener('click', this.openSettings.bind(this));
        clearBtn.addEventListener('click', this.clearResults.bind(this));

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['apiKey']);
            this.apiKey = result.apiKey || this.defaultApiKey;
        } catch (error) {
            console.error('Error loading settings:', error);
            this.apiKey = this.defaultApiKey;
        }
    }

    async handleAddressInput(e) {
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            this.hideSuggestions();
            return;
        }

        // Debounce the search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(async () => {
            await this.searchAddressSuggestions(query);
        }, 300);
    }

    async searchAddressSuggestions(query) {
        try {
            // Using OpenStreetMap Nominatim for address suggestions
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}&countrycodes=us`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch address suggestions');
            }

            const data = await response.json();
            this.displaySuggestions(data);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            this.hideSuggestions();
        }
    }

    displaySuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('suggestions');
        
        if (!suggestions || suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.currentSuggestions = suggestions;
        suggestionsContainer.innerHTML = '';

        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion.display_name;
            item.dataset.index = index;
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });

            suggestionsContainer.appendChild(item);
        });

        suggestionsContainer.style.display = 'block';
    }

    selectSuggestion(suggestion) {
        const addressInput = document.getElementById('address-input');
        addressInput.value = suggestion.display_name;
        this.selectedAddress = suggestion;
        this.hideSuggestions();
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('suggestions');
        suggestionsContainer.style.display = 'none';
    }

    handleKeyDown(e) {
        const suggestionsContainer = document.getElementById('suggestions');
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        if (items.length === 0) return;

        let selectedIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('selected')) {
                selectedIndex = index;
            }
        });

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                this.highlightSuggestion(items, selectedIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                this.highlightSuggestion(items, selectedIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    this.selectSuggestion(this.currentSuggestions[selectedIndex]);
                } else {
                    this.handleSubmit();
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }

    highlightSuggestion(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === index);
        });
    }

    async handleSubmit() {
        const addressInput = document.getElementById('address-input');
        const query = addressInput.value.trim();

        if (!query) {
            this.showError('Please enter an address');
            return;
        }

        this.showLoading(true);
        this.hideError();

        try {
            // If no address was selected from suggestions, try to geocode the input
            if (!this.selectedAddress) {
                await this.geocodeAddress(query);
            }

            if (!this.selectedAddress) {
                throw new Error('Could not find location for the entered address');
            }

            // Get AHJ information for the selected address
            const ahjData = await this.getAHJInformation(this.selectedAddress);
            this.displayResults(ahjData);

        } catch (error) {
            console.error('Error getting AHJ information:', error);
            this.showError(error.message || 'Failed to get AHJ information');
        } finally {
            this.showLoading(false);
        }
    }

    async geocodeAddress(query) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(query)}&countrycodes=us`
            );

            if (!response.ok) {
                throw new Error('Failed to geocode address');
            }

            const data = await response.json();
            if (data && data.length > 0) {
                this.selectedAddress = data[0];
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error('Could not find location for the entered address');
        }
    }

    async getAHJInformation(address) {
        try {
            // For demo purposes, since we don't have access to the actual AHJ Registry API,
            // we'll simulate the API response with realistic data
            const lat = parseFloat(address.lat);
            const lon = parseFloat(address.lon);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Generate realistic AHJ data based on the address
            const ahjData = this.generateMockAHJData(address, lat, lon);
            
            return ahjData;

            // Uncomment this section when the actual AHJ Registry API is available:
            /*
            const response = await fetch(
                `https://ahjregistry.myorangebutton.com/api/v1/ahj/search?lat=${lat}&lon=${lon}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
            */
        } catch (error) {
            console.error('AHJ API error:', error);
            throw new Error('Failed to retrieve AHJ information from the registry');
        }
    }

    generateMockAHJData(address, lat, lon) {
        // Extract location information
        const addressParts = address.address || {};
        const city = addressParts.city || addressParts.town || addressParts.village || 'Unknown City';
        const state = addressParts.state || 'Unknown State';
        const county = addressParts.county || 'Unknown County';
        const zipcode = addressParts.postcode || 'Unknown';



        return {
            address: {
                full_address: address.display_name,
                latitude: lat,
                longitude: lon,
                city: city,
                state: state,
                county: county,
                zipcode: zipcode
            },
            ahj_info: {
                jurisdiction_name: `${city} Building Department`,
                jurisdiction_type: 'Municipal',
                authority_type: 'Building Department',
                contact_info: {
                    name: `${city} Building Department`,
                    phone: '(555) 123-4567',
                    email: `permits@${city.toLowerCase().replace(/\s+/g, '')}.gov`,
                    website: `https://www.${city.toLowerCase().replace(/\s+/g, '')}.gov/building`,
                    address: `City Hall, ${city}, ${state} ${zipcode}`
                },
                permit_requirements: {
                    electrical_permit_required: true,
                    building_permit_required: true,
                    fire_permit_required: false,
                    estimated_review_time: '5-10 business days',
                    permit_fees: '$150-$500 (varies by system size)'
                },
                inspection_requirements: {
                    rough_inspection: true,
                    final_inspection: true,
                    utility_interconnection: true,
                    special_requirements: 'Structural engineer approval may be required for roof-mounted systems'
                },
                codes_and_standards: {
                    building_code: '2018 International Building Code',
                    electrical_code: '2017 National Electrical Code',
                    fire_code: '2018 International Fire Code',
                    zoning_restrictions: 'Setback requirements: 3 feet from property lines'
                }
            },
            utility_info: {
                utility_name: `${city} Electric Utility`,
                interconnection_process: 'Net Metering Available',
                application_required: true,
                estimated_timeline: '30-45 days',
                contact: {
                    phone: '(555) 987-6543',
                    email: 'interconnection@utility.com',
                    website: 'https://www.utility.com/solar'
                }
            },
            additional_notes: [
                'Historic district restrictions may apply',
                'HOA approval may be required',
                'State incentives available through DSIRE database'
            ],
            last_updated: new Date().toISOString().split('T')[0]
        };
    }

    displayResults(data) {
        const resultsContent = document.getElementById('results-content');
        
        if (!resultsContent) {
            console.error('Results content element not found');
            this.showError('Interface error: Could not display results');
            return;
        }

        if (!data) {
            console.error('No data to display');
            this.showError('No AHJ data received');
            return;
        }

        try {
            resultsContent.innerHTML = `
                <div class="result-section">
                    <h3>📍 Address Information</h3>
                    <div class="result-item">
                        <span class="result-label">Address:</span>
                        <span class="result-value">${data.address.full_address}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">City:</span>
                        <span class="result-value">${data.address.city}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">County:</span>
                        <span class="result-value">${data.address.county}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">State:</span>
                        <span class="result-value">${data.address.state}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">ZIP Code:</span>
                        <span class="result-value">${data.address.zipcode}</span>
                    </div>
                </div>

                <div class="result-section">
                    <h3>🏛️ Authority Having Jurisdiction (AHJ)</h3>
                    <div class="result-item">
                        <span class="result-label">Jurisdiction:</span>
                        <span class="result-value">${data.ahj_info.jurisdiction_name}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Type:</span>
                        <span class="result-value">${data.ahj_info.jurisdiction_type}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Authority:</span>
                        <span class="result-value">${data.ahj_info.authority_type}</span>
                    </div>
                    
                    <div class="contact-info">
                        <h4>📞 Contact Information</h4>
                        <div class="result-item">
                            <span class="result-label">Phone:</span>
                            <span class="result-value">${data.ahj_info.contact_info.phone}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Email:</span>
                            <span class="result-value">${data.ahj_info.contact_info.email}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Website:</span>
                            <span class="result-value"><a href="${data.ahj_info.contact_info.website}" target="_blank">${data.ahj_info.contact_info.website}</a></span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Address:</span>
                            <span class="result-value">${data.ahj_info.contact_info.address}</span>
                        </div>
                    </div>
                </div>

                <div class="result-section">
                    <h3>📋 Permit Requirements</h3>
                    <div class="result-item">
                        <span class="result-label">Electrical Permit:</span>
                        <span class="result-value">${data.ahj_info.permit_requirements.electrical_permit_required ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Building Permit:</span>
                        <span class="result-value">${data.ahj_info.permit_requirements.building_permit_required ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Fire Permit:</span>
                        <span class="result-value">${data.ahj_info.permit_requirements.fire_permit_required ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Review Time:</span>
                        <span class="result-value">${data.ahj_info.permit_requirements.estimated_review_time}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Permit Fees:</span>
                        <span class="result-value">${data.ahj_info.permit_requirements.permit_fees}</span>
                    </div>
                </div>

                <div class="result-section">
                    <h3>🔍 Inspection Requirements</h3>
                    <div class="result-item">
                        <span class="result-label">Rough Inspection:</span>
                        <span class="result-value">${data.ahj_info.inspection_requirements.rough_inspection ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Final Inspection:</span>
                        <span class="result-value">${data.ahj_info.inspection_requirements.final_inspection ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Utility Interconnection:</span>
                        <span class="result-value">${data.ahj_info.inspection_requirements.utility_interconnection ? 'Required' : 'Not Required'}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Special Requirements:</span>
                        <span class="result-value">${data.ahj_info.inspection_requirements.special_requirements}</span>
                    </div>
                </div>

                <div class="result-section">
                    <h3>⚡ Utility Information</h3>
                    <div class="result-item">
                        <span class="result-label">Utility Company:</span>
                        <span class="result-value">${data.utility_info.utility_name}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Interconnection:</span>
                        <span class="result-value">${data.utility_info.interconnection_process}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Timeline:</span>
                        <span class="result-value">${data.utility_info.estimated_timeline}</span>
                    </div>
                    
                    <div class="contact-info">
                        <h4>📞 Utility Contact</h4>
                        <div class="result-item">
                            <span class="result-label">Phone:</span>
                            <span class="result-value">${data.utility_info.contact.phone}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Email:</span>
                            <span class="result-value">${data.utility_info.contact.email}</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Website:</span>
                            <span class="result-value"><a href="${data.utility_info.contact.website}" target="_blank">${data.utility_info.contact.website}</a></span>
                        </div>
                    </div>
                </div>

                <div class="result-section">
                    <h3>📝 Additional Notes</h3>
                    ${data.additional_notes.map(note => `
                        <div class="result-item">
                            <span class="result-value">• ${note}</span>
                        </div>
                    `).join('')}
                    <div class="result-item">
                        <span class="result-label">Last Updated:</span>
                        <span class="result-value">${data.last_updated}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error setting results HTML:', error);
            resultsContent.innerHTML = '<div class="result-section"><h3>Error displaying results</h3><p>Please check the console for details.</p></div>';
        }

        this.showView('results');
    }

    showView(viewName) {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        } else {
            console.error(`Could not find view: ${viewName}-view`);
        }
    }

    clearResults() {
        this.selectedAddress = null;
        document.getElementById('address-input').value = '';
        this.hideSuggestions();
        this.hideError();
        this.showView('search');
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const submitBtn = document.getElementById('submit-btn');
        
        if (show) {
            loading.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            loading.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    hideError() {
        const errorElement = document.getElementById('error-message');
        errorElement.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuickAHJSearch();
}); 