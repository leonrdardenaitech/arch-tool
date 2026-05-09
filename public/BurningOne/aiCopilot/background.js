chrome.action.onClicked.addListener(async (tab) => {
  console.log('[ATLAS] Scanning page...');
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'scan' });
    if (!response || !response.fields) return;

    console.log('[ATLAS] Fields detected:', response.fields.length);
    
    const profileUrl = chrome.runtime.getURL('profile.json');
    const profileResponse = await fetch(profileUrl);
    const profile = await profileResponse.json();

    const prompt = `Match the following user profile data to these HTML form fields extracted from a job application.
    Return ONLY a raw JSON object where the key is the HTML element ID or Name, and the value is the corresponding user data.
    
    User Profile:
    ${JSON.stringify(profile, null, 2)}
    
    Form Fields:
    ${JSON.stringify(response.fields, null, 2)}`;

    console.log('[ATLAS] Pinging Ollama (Qwen 2.5)...');
    
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:0.5b',
        prompt: prompt,
        stream: false,
        format: 'json'
      })
    });
    
    const result = await ollamaResponse.json();
    const filledData = JSON.parse(result.response);
    
    console.log('[ATLAS] Injecting data...');
    chrome.tabs.sendMessage(tab.id, { action: 'fill', data: filledData });
  } catch (error) {
    console.error('[ATLAS] Extension Error:', error);
  }
});
