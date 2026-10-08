import fs from 'fs';

const files = ['src/index.css', 'src/App.css', 'src/components/landing/landing.css'];
const tokens = ['gradient', 'backdrop-filter', 'box-shadow', 'border-radius'];

console.log('=== CSS TOKEN COUNTS PER FILE ===');
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  console.log(`File: ${file}`);
  for (const token of tokens) {
    const re = new RegExp(token, 'i');
    const matches = lines.filter((l) => re.test(l)).length;
    console.log(`  ${token}: ${matches}`);
  }
}

console.log('\n=== ALL LINES WITH GRADIENT OR BACKDROP-FILTER ===');
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((l, idx) => {
    if (/gradient|backdrop-filter/i.test(l)) {
      console.log(`${file}:${idx + 1}: ${l.trim()}`);
    }
  });
}
