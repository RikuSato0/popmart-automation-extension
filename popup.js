document.addEventListener('DOMContentLoaded', function() {
  const productUrlInput = document.getElementById('productUrl');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const statusDiv = document.getElementById('status');

  // Load saved URL if exists
  chrome.storage.local.get(['productUrl'], function(result) {
    if (result.productUrl) {
      console.log(result.productUrl,'url')
      productUrlInput.value = result.productUrl;
    }
  });



  startButton.addEventListener('click', function() {
    const productUrl = productUrlInput.value.trim();
    if (!productUrl) {
      alert('Please enter a product URL');
      return;
    }

    // Save URL
    chrome.storage.local.set({ productUrl: productUrl });
 
    // Send message to background script to start monitoring
    chrome.runtime.sendMessage({
      action: 'startMonitoring',
      url: productUrl
    });

    // Update UI
    startButton.style.display = 'none';
    stopButton.style.display = 'block';
    statusDiv.textContent = 'Status: Running';
    statusDiv.className = 'status running';
  });

  stopButton.addEventListener('click', function() {
    // Send message to background script to stop monitoring
    chrome.runtime.sendMessage({ action: 'stopMonitoring' });

    // Update UI
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    statusDiv.textContent = 'Status: Stopped';
    statusDiv.className = 'status stopped';
  });

  // Listen for status updates from background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'statusUpdate') {
      statusDiv.textContent = `Status: ${request.status}`;
      statusDiv.className = `status ${request.status.toLowerCase()}`;
    }
  });
}); 