# Shopify Auto Buyer

A Chrome extension that automates the purchase process for high-demand items on Pop Mart's Shopify store.

## Features

- 🔄 Automatic page refresh to check stock availability
- 🛒 Automated cart addition for multiple items
- 💳 Streamlined checkout process
- 🔔 Desktop notifications for payment confirmation
- ⚡ Fast execution to secure limited stock items

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will appear in your browser toolbar

## Usage

1. Click the extension icon in your browser
2. Enter the product URL you want to monitor
3. Click "Start Monitoring"
4. The extension will automatically refresh the page and attempt to purchase when stock is available
5. Complete the payment manually when prompted

## Files

- `manifest.json` - Extension configuration
- `background.js` - Service worker for tab management
- `content.js` - Main automation script
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality

## Permissions

- `activeTab` - Access to current tab
- `storage` - Save extension settings
- `scripting` - Inject scripts into pages
- Host permissions for `*.popmart.com`

## Disclaimer

This extension is for educational purposes only. Automated purchasing may violate website terms of service. Use at your own risk.

## License

MIT License

