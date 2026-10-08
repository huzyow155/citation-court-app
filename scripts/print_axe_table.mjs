import fs from 'fs';

const s = JSON.parse(fs.readFileSync('docs/a11y/summary.json', 'utf8'));
console.log(`axe-core Version: ${s.axeVersion}`);
console.log(`Rule tags: ${s.ruleTags.join(', ')}`);
console.log('');
console.log('| Target | Route | Viewport | Passes | Incomplete | Violations | Raw JSON File |');
console.log('|---|---|---|---|---|---|---|');
for (const r of s.results) {
  console.log(`| ${r.target} | ${r.route} | ${r.viewport} (${r.resolution}) | ${r.passes} | ${r.incomplete} | ${r.violations} | [${r.file}](./${r.file}) |`);
}
