chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scan') {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(el => {
      const label = document.querySelector(`label[for="${el.id}"]`) || el.closest('label');
      return {
        id: el.id,
        name: el.name,
        placeholder: el.placeholder,
        label: label ? label.innerText.trim() : '',
        type: el.type
      };
    });
    sendResponse({ fields: inputs });
  } else if (request.action === 'fill') {
    for (const [id, value] of Object.entries(request.data)) {
      const el = document.getElementById(id) || document.getElementsByName(id)[0];
      if (el) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }
  return true;
});
