const sharp = require('sharp');
const fs = require('fs');

// Create SVG icon
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#E50914"/>
  <text 
    x="256" 
    y="320" 
    font-family="Arial Black, Arial" 
    font-size="220" 
    font-weight="900"
    fill="white" 
    text-anchor="middle"
  >CV</text>
</svg>`;

// Save SVG
fs.writeFileSync('./public/icon.svg', svgIcon);

// Create 192x192
sharp('./public/icon.svg')
  .resize(192, 192)
  .png()
  .toFile('./public/icon-192.png', (err) => {
    if (err) console.error('192 error:', err);
    else console.log('✅ icon-192.png created');
  });

// Create 512x512
sharp('./public/icon.svg')
  .resize(512, 512)
  .png()
  .toFile('./public/icon-512.png', (err) => {
    if (err) console.error('512 error:', err);
    else console.log('✅ icon-512.png created');
  });

console.log('Icons created!');
