const key = 'AIzaSyDXrFshJZJEs4pLZtNtf-cp0w2O3mTUPr4';
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`;

fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
  })
}).then(res => res.text()).then(text => console.log(text)).catch(console.error);
