// Settings page functionality
class SettingsManager {
    constructor() {
        this.init();
        this.defaultSettings = this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            // Theme & Display
            themeOverride: 'system',
            viewMode: 'detailed',
            defaultUnits: 'imperial',
            
            // Data Sources
            dataSourcesPriority: ['solarapp', 'municipal', 'upcodes', 'shovels'],
            enabledDataSources: {
                solarapp: true,
                municipal: true,
                upcodes: true,
                shovels: true
            },
            offlineMode: false,
            
            // Result Display
            visibleSections: {
                address: true,
                ahj: true,
                permits: true,
                inspections: true,
                utilities: true,
                codes: true
            },
            autoExpandSections: {
                address: false,
                ahj: true,
                permits: true,
                inspections: false,
                utilities: false,
                codes: false
            },
            
            // Search Settings
            searchRadius: 10,
            recentSearchesLimit: 10,
            
            // Export Settings
            exportFormat: 'txt',
            exportFields: {
                address: true,
                ahj: true,
                permits: true,
                inspections: true,
                utilities: true,
                codes: true,
                timestamp: true
            },
            
            // Professional Settings
            companyName: '',
            companyAddress: '',
            companyContact: '',
            defaultProjectType: 'solar',
            customNotes: '',
            
            // Technical Settings
            requestTimeout: 10,
            retryAttempts: 3,
            debugMode: false,
            
            // Integrations
            calendarIntegration: false,
            crmSystem: 'none',
            crmWebhookUrl: ''
        };
    }

    async init() {
        this.setupEventListeners();
        await this.loadSettings();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('save-btn');
        const resetBtn = document.getElementById('reset-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const downloadHistoryBtn = document.getElementById('download-history-btn');
        const clearHistoryBtn = document.getElementById('clear-history-btn');
        const themeSelect = document.getElementById('theme-override');
        const crmSelect = document.getElementById('crm-system');

        saveBtn.addEventListener('click', this.saveSettings.bind(this));
        resetBtn.addEventListener('click', this.resetToDefaults.bind(this));
        cancelBtn.addEventListener('click', this.cancel.bind(this));
        downloadHistoryBtn.addEventListener('click', this.downloadHistory.bind(this));
        clearHistoryBtn.addEventListener('click', this.clearHistory.bind(this));

        // Save theme on change
        themeSelect.addEventListener('change', this.saveTheme.bind(this));
        
        // Show/hide CRM webhook URL field
        crmSelect.addEventListener('change', this.toggleCrmWebhookField.bind(this));
    }

    setupDragAndDrop() {
        const priorityList = document.getElementById('data-sources-priority');
        let draggedElement = null;

        priorityList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('priority-item')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });

        priorityList.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('priority-item')) {
                e.target.style.opacity = '';
                draggedElement = null;
            }
        });

        priorityList.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        priorityList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement && e.target.classList.contains('priority-item')) {
                const rect = e.target.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    priorityList.insertBefore(draggedElement, e.target);
                } else {
                    priorityList.insertBefore(draggedElement, e.target.nextSibling);
                }
            }
        });

        // Make items draggable
        priorityList.querySelectorAll('.priority-item').forEach(item => {
            item.draggable = true;
        });
    }

    toggleCrmWebhookField() {
        const crmSelect = document.getElementById('crm-system');
        const webhookGroup = document.getElementById('crm-webhook-group');
        
        if (crmSelect.value === 'custom') {
            webhookGroup.style.display = 'block';
        } else {
            webhookGroup.style.display = 'none';
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                'themeOverride', 'viewMode', 'defaultUnits', 'dataSourcesPriority', 
                'enabledDataSources', 'offlineMode', 'visibleSections', 'autoExpandSections',
                'searchRadius', 'recentSearchesLimit', 'exportFormat', 'exportFields',
                'companyName', 'companyAddress', 'companyContact', 'defaultProjectType',
                'customNotes', 'requestTimeout', 'retryAttempts', 'debugMode',
                'calendarIntegration', 'crmSystem', 'crmWebhookUrl'
            ]);

            // Load all settings with defaults
            this.loadThemeSettings(result);
            this.loadDataSourceSettings(result);
            this.loadDisplaySettings(result);
            this.loadSearchSettings(result);
            this.loadExportSettings(result);
            this.loadProfessionalSettings(result);
            this.loadTechnicalSettings(result);
            this.loadIntegrationSettings(result);

        } catch (error) {
            console.error('Error loading settings:', error);
            this.showMessage('Error loading settings', 'error');
        }
    }

    loadThemeSettings(result) {
        document.getElementById('theme-override').value = result.themeOverride || this.defaultSettings.themeOverride;
        document.getElementById('view-mode').value = result.viewMode || this.defaultSettings.viewMode;
        document.getElementById('default-units').value = result.defaultUnits || this.defaultSettings.defaultUnits;
    }

    loadDataSourceSettings(result) {
        // Load data source priority
        const priority = result.dataSourcesPriority || this.defaultSettings.dataSourcesPriority;
        const enabledSources = result.enabledDataSources || this.defaultSettings.enabledDataSources;
        
        const priorityList = document.getElementById('data-sources-priority');
        const items = Array.from(priorityList.children);
        
        // Reorder items based on saved priority
        priority.forEach((source, index) => {
            const item = items.find(i => i.dataset.source === source);
            if (item) {
                priorityList.appendChild(item);
                const checkbox = item.querySelector('.source-enabled');
                checkbox.checked = enabledSources[source] !== false;
            }
        });

        document.getElementById('offline-mode').checked = result.offlineMode || false;
    }

    loadDisplaySettings(result) {
        const visibleSections = result.visibleSections || this.defaultSettings.visibleSections;
        const autoExpandSections = result.autoExpandSections || this.defaultSettings.autoExpandSections;

        Object.keys(visibleSections).forEach(section => {
            const checkbox = document.getElementById(`show-${section}`);
            if (checkbox) checkbox.checked = visibleSections[section];
        });

        Object.keys(autoExpandSections).forEach(section => {
            const checkbox = document.getElementById(`expand-${section}`);
            if (checkbox) checkbox.checked = autoExpandSections[section];
        });
    }

    loadSearchSettings(result) {
        document.getElementById('search-radius').value = result.searchRadius || this.defaultSettings.searchRadius;
        document.getElementById('recent-searches-limit').value = result.recentSearchesLimit || this.defaultSettings.recentSearchesLimit;
    }

    loadExportSettings(result) {
        document.getElementById('export-format').value = result.exportFormat || this.defaultSettings.exportFormat;
        
        const exportFields = result.exportFields || this.defaultSettings.exportFields;
        Object.keys(exportFields).forEach(field => {
            const checkbox = document.getElementById(`export-${field}`);
            if (checkbox) checkbox.checked = exportFields[field];
        });
    }

    loadProfessionalSettings(result) {
        document.getElementById('company-name').value = result.companyName || '';
        document.getElementById('company-address').value = result.companyAddress || '';
        document.getElementById('company-contact').value = result.companyContact || '';
        document.getElementById('default-project-type').value = result.defaultProjectType || this.defaultSettings.defaultProjectType;
        document.getElementById('custom-notes').value = result.customNotes || '';
    }

    loadTechnicalSettings(result) {
        document.getElementById('request-timeout').value = result.requestTimeout || this.defaultSettings.requestTimeout;
        document.getElementById('retry-attempts').value = result.retryAttempts || this.defaultSettings.retryAttempts;
        document.getElementById('debug-mode').checked = result.debugMode || false;
    }

    loadIntegrationSettings(result) {
        document.getElementById('calendar-integration').checked = result.calendarIntegration || false;
        document.getElementById('crm-system').value = result.crmSystem || this.defaultSettings.crmSystem;
        document.getElementById('crm-webhook-url').value = result.crmWebhookUrl || '';
        this.toggleCrmWebhookField();
    }

    async saveSettings() {
        try {
            const settings = this.gatherAllSettings();
            await chrome.storage.sync.set(settings);

            this.showMessage('All settings saved successfully!', 'success');
            
            // Auto-close after 2 seconds
            setTimeout(() => {
                window.close();
            }, 2000);

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }

    gatherAllSettings() {
        return {
            // Theme & Display
            themeOverride: document.getElementById('theme-override').value,
            viewMode: document.getElementById('view-mode').value,
            defaultUnits: document.getElementById('default-units').value,
            
            // Data Sources
            dataSourcesPriority: this.getDataSourcePriority(),
            enabledDataSources: this.getEnabledDataSources(),
            offlineMode: document.getElementById('offline-mode').checked,
            
            // Result Display
            visibleSections: this.getVisibleSections(),
            autoExpandSections: this.getAutoExpandSections(),
            
            // Search Settings
            searchRadius: parseInt(document.getElementById('search-radius').value),
            recentSearchesLimit: parseInt(document.getElementById('recent-searches-limit').value),
            
            // Export Settings
            exportFormat: document.getElementById('export-format').value,
            exportFields: this.getExportFields(),
            
            // Professional Settings
            companyName: document.getElementById('company-name').value,
            companyAddress: document.getElementById('company-address').value,
            companyContact: document.getElementById('company-contact').value,
            defaultProjectType: document.getElementById('default-project-type').value,
            customNotes: document.getElementById('custom-notes').value,
            
            // Technical Settings
            requestTimeout: parseInt(document.getElementById('request-timeout').value),
            retryAttempts: parseInt(document.getElementById('retry-attempts').value),
            debugMode: document.getElementById('debug-mode').checked,
            
            // Integrations
            calendarIntegration: document.getElementById('calendar-integration').checked,
            crmSystem: document.getElementById('crm-system').value,
            crmWebhookUrl: document.getElementById('crm-webhook-url').value
        };
    }

    getDataSourcePriority() {
        const priorityList = document.getElementById('data-sources-priority');
        return Array.from(priorityList.children).map(item => item.dataset.source);
    }

    getEnabledDataSources() {
        const enabled = {};
        document.querySelectorAll('.source-enabled').forEach(checkbox => {
            const source = checkbox.closest('.priority-item').dataset.source;
            enabled[source] = checkbox.checked;
        });
        return enabled;
    }

    getVisibleSections() {
        const sections = {};
        ['address', 'ahj', 'permits', 'inspections', 'utilities', 'codes'].forEach(section => {
            const checkbox = document.getElementById(`show-${section}`);
            sections[section] = checkbox ? checkbox.checked : true;
        });
        return sections;
    }

    getAutoExpandSections() {
        const sections = {};
        ['address', 'ahj', 'permits', 'inspections', 'utilities', 'codes'].forEach(section => {
            const checkbox = document.getElementById(`expand-${section}`);
            sections[section] = checkbox ? checkbox.checked : false;
        });
        return sections;
    }

    getExportFields() {
        const fields = {};
        ['address', 'ahj', 'permits', 'inspections', 'utilities', 'codes', 'timestamp'].forEach(field => {
            const checkbox = document.getElementById(`export-${field}`);
            fields[field] = checkbox ? checkbox.checked : true;
        });
        return fields;
    }

    async resetToDefaults() {
        if (!confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
            return;
        }

        try {
            await chrome.storage.sync.set(this.defaultSettings);
            await this.loadSettings();
            this.showMessage('Settings reset to defaults', 'success');
        } catch (error) {
            console.error('Error resetting settings:', error);
            this.showMessage('Error resetting settings', 'error');
        }
    }

    async saveTheme() {
        const themeSelect = document.getElementById('theme-override');
        const themeOverride = themeSelect.value;

        try {
            await chrome.storage.sync.set({
                themeOverride: themeOverride
            });
            this.showMessage('Theme setting saved', 'success');
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }

    async downloadHistory() {
        try {
            const result = await chrome.storage.local.get(['recentSearches']);
            const recentSearches = result.recentSearches || [];

            if (recentSearches.length === 0) {
                this.showMessage('No search history to download', 'error');
                return;
            }

            // Get export format preference
            const settings = await chrome.storage.sync.get(['exportFormat', 'exportFields']);
            const format = settings.exportFormat || 'txt';

            let content, filename;
            
            switch (format) {
                case 'json':
                    content = this.formatHistoryAsJSON(recentSearches, settings.exportFields);
                    filename = this.generateHistoryFilename('json');
                    break;
                case 'csv':
                    content = this.formatHistoryAsCSV(recentSearches, settings.exportFields);
                    filename = this.generateHistoryFilename('csv');
                    break;
                default:
                    content = this.formatHistoryForDownload(recentSearches);
                    filename = this.generateHistoryFilename('txt');
            }

            this.downloadFile(content, filename, format);
            this.showMessage(`Downloaded data for ${recentSearches.length} recent searches`, 'success');

        } catch (error) {
            console.error('Error downloading history:', error);
            this.showMessage('Error downloading search history', 'error');
        }
    }

    formatHistoryAsJSON(searches, exportFields) {
        const filteredSearches = searches.map(search => {
            const filtered = {};
            if (exportFields?.timestamp !== false) filtered.timestamp = search.timestamp;
            if (exportFields?.address !== false) filtered.address = search.address;
            filtered.display_name = search.display_name;
            filtered.coordinates = { lat: search.lat, lon: search.lon };
            return filtered;
        });
        
        return JSON.stringify({
            export_info: {
                tool: "QuickAHJ Extension",
                exported_at: new Date().toISOString(),
                total_searches: searches.length
            },
            searches: filteredSearches
        }, null, 2);
    }

    formatHistoryAsCSV(searches, exportFields) {
        let headers = ['Display Name', 'Latitude', 'Longitude'];
        if (exportFields?.address !== false) headers.push('City', 'State');
        if (exportFields?.timestamp !== false) headers.push('Search Date');
        
        let csv = headers.join(',') + '\n';
        
        searches.forEach(search => {
            let row = [
                `"${search.display_name}"`,
                search.lat,
                search.lon
            ];
            
            if (exportFields?.address !== false) {
                row.push(`"${search.address?.city || 'Unknown'}"`, `"${search.address?.state || 'Unknown'}"`);
            }
            
            if (exportFields?.timestamp !== false) {
                row.push(`"${new Date(search.timestamp).toLocaleString()}"`);
            }
            
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    async clearHistory() {
        if (!confirm('Are you sure you want to clear your search history? This action cannot be undone.')) {
            return;
        }

        try {
            await chrome.storage.local.set({ recentSearches: [] });
            this.showMessage('Search history cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing history:', error);
            this.showMessage('Error clearing search history', 'error');
        }
    }

    formatHistoryForDownload(searches) {
        let content = `QuickAHJ Search History\n${'='.repeat(26)}\n`;
        content += `Downloaded: ${new Date().toLocaleString()}\n`;
        content += `Total Searches: ${searches.length}\n\n`;

        searches.forEach((search, index) => {
            const searchDate = new Date(search.timestamp).toLocaleString();
            const city = search.address?.city || 'Unknown City';
            const state = search.address?.state || 'Unknown State';
            
            content += `${index + 1}. ${search.display_name}\n`;
            content += `   Location: ${city}, ${state}\n`;
            content += `   Searched: ${searchDate}\n`;
            content += `   Coordinates: ${search.lat}, ${search.lon}\n\n`;
        });

        content += `\n--- End of History ---\n`;
        content += `This report was generated by QuickAHJ Extension\n`;
        content += `To get detailed AHJ information, search for these addresses again in the extension.\n`;

        return content;
    }

    generateHistoryFilename(extension = 'txt') {
        const date = new Date().toISOString().split('T')[0];
        return `QuickAHJ_SearchHistory_${date}.${extension}`;
    }

    downloadFile(content, filename, format) {
        let mimeType;
        switch (format) {
            case 'json':
                mimeType = 'application/json';
                break;
            case 'csv':
                mimeType = 'text/csv';
                break;
            default:
                mimeType = 'text/plain';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    cancel() {
        window.close();
    }

    showMessage(message, type) {
        const messageElement = document.getElementById('save-message');
        messageElement.textContent = message;
        messageElement.className = `save-message ${type === 'error' ? 'error-message' : ''}`;
        messageElement.classList.remove('hidden');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }

    clearMessage() {
        const messageElement = document.getElementById('save-message');
        messageElement.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
}); 