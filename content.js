/**
 * Content script for the Webpage Clipper extension
 * Extracts page content and sends it to the background script
 */

// Function to extract text content from the DOM
function extractTextContent(doc) {
  // Get all text nodes from the body
  const bodyText = doc.body.innerText || doc.body.textContent || '';
  
  // Limit to first 100 words
  const words = bodyText.split(/\s+/);
  const firstHundredWords = words.slice(0, 100).join(' ');
  
  return firstHundredWords + (words.length > 100 ? '...' : '');
}

// Function to get word count
function getWordCount(doc) {
  // Get all text nodes from the body
  const bodyText = doc.body.innerText || doc.body.textContent || '';
  
  const count = words.length
  
  return words.length;
}

// Function to clip the current page
function clipCurrentPage() {
  const pageData = {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    content: extractTextContent(document),
    word_count: getWordCount(document)
  };
  
  // Send the data to the background script
  chrome.runtime.sendMessage({
    action: 'clipPage',
    data: pageData
  }, response => {
    if (response && response.success) {
      console.log('Page clipped successfully');
    } else {
      console.error('Failed to clip page');
    }
  });
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Respond to ping to check if content script is loaded
  if (message.action === 'ping') {
    sendResponse({ success: true });
    return;
  }
  
  if (message.action === 'clipPage') {
    clipCurrentPage();
    sendResponse({ success: true });
  }
});
