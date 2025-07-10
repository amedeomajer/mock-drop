// Popup script for Pixel-Perfect Image Overlay Tool
document.addEventListener('DOMContentLoaded', function() {
  const activateBtn = document.getElementById('activate-btn');
  const deactivateBtn = document.getElementById('deactivate-btn');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = statusIndicator.querySelector('.status-text');
  const statusDot = statusIndicator.querySelector('.status-dot');
  
  let isActive = false;
  
  // Check if the tool is already active on the current tab
  checkActiveStatus();
  
  // Activate button click handler
  activateBtn.addEventListener('click', function() {
    activateTool();
  });
  
  // Deactivate button click handler
  deactivateBtn.addEventListener('click', function() {
    deactivateTool();
  });
  
  function checkActiveStatus() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Check if content script is already injected
      chrome.tabs.sendMessage(currentTab.id, {action: 'checkStatus'}, function(response) {
        if (chrome.runtime.lastError) {
          // Content script not active
          setStatus('inactive', 'Tool not active');
          showActivateButton();
        } else {
          // Content script is active
          setStatus('active', 'Tool is active');
          showDeactivateButton();
          isActive = true;
        }
      });
    });
  }
  
  function activateTool() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Inject content script
      chrome.scripting.executeScript({
        target: {tabId: currentTab.id},
        files: ['content.js']
      }, function() {
        if (chrome.runtime.lastError) {
          console.error('Failed to inject content script:', chrome.runtime.lastError);
          setStatus('error', 'Failed to activate');
        } else {
          setStatus('active', 'Tool activated successfully');
          showDeactivateButton();
          isActive = true;
        }
      });
    });
  }
  
  function deactivateTool() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      
      // Send message to content script to deactivate
      chrome.tabs.sendMessage(currentTab.id, {action: 'deactivate'}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Failed to deactivate:', chrome.runtime.lastError);
        } else {
          setStatus('inactive', 'Tool deactivated');
          showActivateButton();
          isActive = false;
        }
      });
    });
  }
  
  function setStatus(status, text) {
    statusText.textContent = text;
    statusIndicator.className = 'status-indicator ' + status;
    statusDot.className = 'status-dot ' + status;
  }
  
  function showActivateButton() {
    activateBtn.style.display = 'block';
    deactivateBtn.style.display = 'none';
  }
  
  function showDeactivateButton() {
    activateBtn.style.display = 'none';
    deactivateBtn.style.display = 'block';
  }
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'statusUpdate') {
      if (request.isActive) {
        setStatus('active', 'Tool is active');
        showDeactivateButton();
        isActive = true;
      } else {
        setStatus('inactive', 'Tool not active');
        showActivateButton();
        isActive = false;
      }
    }
  });
}); 