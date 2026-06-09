const fs = require('fs');
async function testOCR() {
  const formData = new FormData();
  // Using an existing file
  const fileBlob = new Blob([fs.readFileSync('education_hub_screenshot.png')], { type: 'image/png' });
  formData.append('file', fileBlob, 'education_hub_screenshot.png');
  formData.append('email', 'admin@docflow.ai');
  formData.append('mode', 'ocr');
  formData.append('prompt', 'Identify and transcribe all readable text from this image exactly.');

  try {
    const res = await fetch('http://localhost:8080/api/ai/generate', {
      method: 'POST',
      body: formData
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text.substring(0, 500));
  } catch (err) {
    console.error(err);
  }
}
testOCR();
