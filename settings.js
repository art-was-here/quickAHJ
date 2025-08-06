// Settings page functionality
class SettingsManager {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadSettings();
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const apiKeyInput = document.getElementById('api-key');

        saveBtn.addEventListener('click', this.saveSettings.bind(this));
        cancelBtn.addEventListener('click', this.cancel.bind(this));

        // Save on Enter key
        apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveSettings();
            }
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['apiKey']);
            const apiKeyInput = document.getElementById('api-key');
            
            if (result.apiKey) {
                apiKeyInput.value = result.apiKey;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showMessage('Error loading settings', 'error');
        }
    }

    async saveSettings() {
        const apiKeyInput = document.getElementById('api-key');
        const apiKey = apiKeyInput.value.trim();

        try {
            // Save to Chrome storage
            await chrome.storage.sync.set({
                apiKey: apiKey
            });

            this.showMessage('Settings saved successfully!', 'success');
            
            // Auto-close after 2 seconds
            setTimeout(() => {
                window.close();
            }, 2000);

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
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