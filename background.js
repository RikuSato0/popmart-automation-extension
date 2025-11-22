let currentTab = null;

// Function to navigate to the product URL
async function navigateToProduct(url) {
  try {
    // Get the current active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tabs[0];
    
    // Navigate to the product URL
    await chrome.tabs.update(currentTab.id, { url: url });
    
    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Inject the content script
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ['content.js']
    });
    
    // Send message to start monitoring
    chrome.tabs.sendMessage(currentTab.id, { action: 'startMonitoring' });
    
  } catch (error) {
    console.error('Failed to navigate to product:', error);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startMonitoring') {
    navigateToProduct(request.url);
  } else if (request.action === 'stopMonitoring' && currentTab) {
    chrome.tabs.sendMessage(currentTab.id, { action: 'stopMonitoring' });
  }
}); 