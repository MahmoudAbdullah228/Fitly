import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logosDir = path.join(__dirname, 'public', 'assets', 'logos');
const avatarsDir = path.join(__dirname, 'public', 'assets', 'avatars');

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

const companies = [
  { id: 'nilepay', name: 'NilePay', color: '#0d74ce', initials: 'NP' },
  { id: 'khedive-health', name: 'Khedive Health', color: '#16a34a', initials: 'KH' },
  { id: 'alex-data-labs', name: 'Alex Data Labs', color: '#8145b5', initials: 'AD' },
  { id: 'kemet-logistics', name: 'Kemet Logistics', color: '#ab6400', initials: 'KL' },
  { id: 'cairofin', name: 'CairoFin', color: '#171717', initials: 'CF' },
  { id: 'pyramids-cloud', name: 'Pyramids Cloud', color: '#0284c7', initials: 'PC' },
  { id: 'sinai-ai', name: 'Sinai AI', color: '#4f46e5', initials: 'SA' },
  { id: 'delta-retail', name: 'Delta Retail', color: '#ea580c', initials: 'DR' },
  { id: 'redsea-media', name: 'RedSea Media', color: '#dc2626', initials: 'RS' },
  { id: 'oasis-iot', name: 'Oasis IoT', color: '#059669', initials: 'OS' },
  { id: 'menatalent', name: 'MenaTalent', color: '#2563eb', initials: 'MT' },
  { id: 'nilecommerce', name: 'NileCommerce', color: '#d97706', initials: 'NC' },
];

for (const comp of companies) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect width="80" height="80" rx="16" fill="${comp.color}" />
  <text x="40" y="48" font-family="'Inter', sans-serif" font-size="28" font-weight="600" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">${comp.initials}</text>
</svg>`;
  fs.writeFileSync(path.join(logosDir, `${comp.id}.svg`), svg);
}
console.log(`Generated ${companies.length} company SVG logos`);

// Candidate stylized portrait avatars (SVG)
const avatars = [
  { file: 'omar-tarek.jpg', name: 'Omar Tarek', bg: '#0d74ce', fg: '#ffffff', initials: 'OT' },
  { file: 'salma-hassan.jpg', name: 'Salma Hassan', bg: '#16a34a', fg: '#ffffff', initials: 'SH' },
  { file: 'karim-mostafa.jpg', name: 'Karim Mostafa', bg: '#dc2626', fg: '#ffffff', initials: 'KM' },
  { file: 'nour-mansour.jpg', name: 'Nour Mansour', bg: '#8145b5', fg: '#ffffff', initials: 'NM' },
  { file: 'default-avatar.svg', name: 'Default', bg: '#999999', fg: '#ffffff', initials: 'CV' },
];

for (const av of avatars) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="g_${av.initials}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${av.bg}" />
      <stop offset="100%" stop-color="#171717" />
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="60" fill="url(#g_${av.initials})" />
  <circle cx="60" cy="46" r="24" fill="#ffffff" opacity="0.9" />
  <path d="M26 104 C30 76, 90 76, 94 104 Z" fill="#ffffff" opacity="0.9" />
  <text x="60" y="54" font-family="'Inter', sans-serif" font-size="18" font-weight="700" fill="${av.bg}" text-anchor="middle">${av.initials}</text>
</svg>`;
  fs.writeFileSync(path.join(avatarsDir, av.file), svg);
}
console.log(`Generated ${avatars.length} candidate SVG avatars`);
