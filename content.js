isMonitoring = false;
checkInterval = null;

// Function to wait for an element to appear
function waitForElement(selector, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Timeout waiting for element: ${selector}`));
        return;
      }
      
      setTimeout(checkElement, 100);
    };
    
    checkElement();
  });
}

// Function to click an element
async function clickElement(selector) {
  try {
    const element = await waitForElement(selector);
    element.click();
    return true;
  } catch (error) {
    console.error(`Failed to click element: ${selector}`, error);
    return false;
  }
}

// Function to check a checkbox
async function checkCheckbox(selector) {
  try {
    const checkbox = await waitForElement(selector);
      await new Promise(resolve => setTimeout(resolve, 2000));

    if (!checkbox.checked) {
      checkbox.click();
      // Wait for 2 seconds after checking the checkbox
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return true;
  } catch (error) {
    console.error(`Failed to check checkbox: ${selector}`, error);
    return false;
  }
}
// Function to input
async function inputText(selector, text) {
  try {
    console.log(selector,'selecty')
    console.log(text,'text')
    const input = await waitForElement(selector);
    console.log(input,'input')

    // Set the input value
    input.value = text;
    console.log(input.value,'vlaue')

    // Dispatch 'input' and 'change' events
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  } catch (error) {
    console.error(`Failed to input text in element: ${selector}`, error);
    return false;
  }
}

// Function to refresh the page
function refreshPage() {
  window.location.reload();
  startMonitoring();
}

// Main automation function
async function automatePurchase() {
  try {
    // Step 1: Click "Buy Multiple Boxes" button
    await clickElement('button.index_chooseMulitityBtn__n0MoA');
    // Step 2: Check "Select All" checkbox in modal and wait 2 seconds
    await checkCheckbox('label.index_selectAll__W_Obs input[type="checkbox"]');
    
    // Step 3: Click "ADD TO BAG" button
    await clickElement('button.index_btn__Y5dKo');
    
    // Step 4: Close the modal
    await clickElement('button.ant-modal-close');
    
    // Step 5: Click cart icon
    await clickElement('div.index_cartItem__xumFD');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 6: Check "Select All" checkbox in cart
    // await checkCheckbox('div.index_checkboxLeft__2x_K1 input[type="checkbox"]');
    
    // Step 7: Click "Confirm and Check out" button
    await clickElement('button.index_checkout__V9YPC');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Step 8: Click "PROCEED TO PAY" button
    await clickElement('button.index_placeOrderBtn__wgYr6');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 9: Click "Credit Card" button
    await clickElement('.index_cardIcon__M9_Gu');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Request notification permission if not already granted
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    
    // Create and show popup
    const popup = document.createElement('div');
    popup.style.cssText = `
      position: fixed;
      top: 20%;
      left: 80%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 9999;
      text-align: center;
    `;
    
    popup.innerHTML = `
      <h3 style="margin-bottom: 15px;">Payment Required</h3>
      <p style="margin-bottom: 20px;">Please input your payment details and click continue when ready.</p>
      <button id="continuePayment" style="
        padding: 10px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      ">Continue to Payment</button>
    `;
    
    document.body.appendChild(popup);
    
    // Show notification
    if (Notification.permission === "granted") {
      const notification = new Notification("Pop Mart Purchase", {
        body: "Please input payment details and click continue",
        icon: "https://www.popmart.com/favicon.ico"
      });
    }
    
    // Wait for continue button click
    await new Promise((resolve) => {
      document.getElementById('continuePayment').addEventListener('click', () => {
        popup.remove();
        resolve();
      });
    });
    
    // Step 14: Click "Pay" button
    await clickElement('button.adyen-checkout__button--pay');
    
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Stop monitoring after successful purchase
    startMonitoring();
    
  } catch (error) {
    console.error('Automation failed:', error);
  }
}

// Function to start monitoring
async function startMonitoring() {
  if (isMonitoring) return;
  
  isMonitoring = true;
    // Check if "Buy Multiple Boxes" button exists
    await new Promise(resolve => setTimeout(resolve, 10000));
    const buyButton = document.querySelector('button.index_chooseMulitityBtn__n0MoA');
    if (buyButton) {
      await automatePurchase();
    } else {
      // If button doesn't exist, refresh the page
      console.log("don't exsit")
      isMonitoring=false;
      refreshPage();
    }
}

// Function to stop monitoring
function stopMonitoring() {
  if (!isMonitoring) return;
  
  isMonitoring = false;
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startMonitoring') {
    startMonitoring();
  } else if (request.action === 'stopMonitoring') {
    stopMonitoring();
  }
}); 