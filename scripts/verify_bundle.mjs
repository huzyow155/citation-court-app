import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist/assets');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/assets directory not found. Please run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter(f => f.endsWith('.js'));
let hasContractAddress = false;
let leakedSecrets = [];

const CONTRACT_ADDRESS = '0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5'.toLowerCase();
const FORBIDDEN_PATTERNS = [
  /THROWAWAY_PRIVATE_KEY/i,
  /0x4c3605baF9adc5e7473332D84F85a8D13938cF18/i, // throwaway public key only in probe
  /mnemonic/i,
];

for (const file of files) {
  const content = fs.readFileSync(path.join(distDir, file), 'utf8');
  if (content.toLowerCase().includes(CONTRACT_ADDRESS)) {
    hasContractAddress = true;
  }
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      leakedSecrets.push({ file, pattern: pattern.toString() });
    }
  }
}

console.log('--- Production Bundle Audit ---');
console.log(`Scanned ${files.length} JavaScript asset files.`);
console.log(`Contract address presence: ${hasContractAddress ? 'PASS' : 'FAIL'}`);

if (!hasContractAddress) {
  console.error('FAILED: Contract address not found in production bundle.');
  process.exit(1);
}

if (leakedSecrets.length > 0) {
  console.error('FAILED: Potential secret patterns detected:', leakedSecrets);
  process.exit(1);
}

console.log('Zero secret leaks detected. Bundle verification PASSED.');
