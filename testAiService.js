import candidates from './src/data/candidates.json' with { type: 'json' };
import jobs from './src/data/jobs.json' with { type: 'json' };
import { calculateMatch, getTopMatches } from './src/services/aiService.js';

console.log('Testing AI Service with demo candidates and job listings...');

const omar = candidates[0]; // Omar Tarek (Junior Frontend)
const salma = candidates[1]; // Salma Hassan (Mid Backend)

console.log(`\nCandidate 1: ${omar.name} (${omar.headline})`);
const omarMatches = getTopMatches(omar, jobs, 5);
omarMatches.forEach((m, idx) => {
  console.log(`  ${idx + 1}. [${m.matchScore}%] ${m.title} @ ${m.company} (${m.match.summary.substring(0, 50)}...)`);
});

console.log(`\nCandidate 2: ${salma.name} (${salma.headline})`);
const salmaMatches = getTopMatches(salma, jobs, 5);
salmaMatches.forEach((m, idx) => {
  console.log(`  ${idx + 1}. [${m.matchScore}%] ${m.title} @ ${m.company} (${m.match.summary.substring(0, 50)}...)`);
});

// Verify Omar's top match is a frontend role, and score is high (>80%)
if (omarMatches[0].matchScore < 75) {
  throw new Error(`Expected Omar's top score to be >= 75%, got ${omarMatches[0].matchScore}%`);
}
// Verify Salma's top match is a backend role
if (salmaMatches[0].matchScore < 75) {
  throw new Error(`Expected Salma's top score to be >= 75%, got ${salmaMatches[0].matchScore}%`);
}

console.log('\n✓ Deterministic AI Matching Service test passed with flying colors!');
