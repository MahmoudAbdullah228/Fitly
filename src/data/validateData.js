import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validate() {
  console.log('Validating Fitly dataset schema...');

  const skillsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'skills.json'), 'utf8'));
  const candidatesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'candidates.json'), 'utf8'));
  const companiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'companies.json'), 'utf8'));
  const jobsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'jobs.json'), 'utf8'));
  const plansData = JSON.parse(fs.readFileSync(path.join(__dirname, 'plans.json'), 'utf8'));
  const templatesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'templates.json'), 'utf8'));

  // 1. Check skills
  if (!Array.isArray(skillsData.skills) || skillsData.skills.length === 0) {
    throw new Error('skills.json is missing skills array');
  }
  console.log(`✓ skills.json: ${skillsData.skills.length} skills loaded`);

  // 2. Check companies
  if (!Array.isArray(companiesData) || companiesData.length === 0) {
    throw new Error('companies.json is missing companies array');
  }
  const companyIds = new Set(companiesData.map(c => c.id));
  console.log(`✓ companies.json: ${companiesData.length} companies loaded`);

  // 3. Check jobs
  if (!Array.isArray(jobsData) || jobsData.length < 40) {
    throw new Error(`jobs.json should contain at least 40 jobs, found: ${jobsData.length}`);
  }
  jobsData.forEach((job, idx) => {
    const requiredProps = ['id', 'title', 'company', 'companyId', 'location', 'workMode', 'employmentType', 'seniority', 'salaryRange', 'postedDaysAgo', 'source', 'description', 'responsibilities', 'requiredSkills'];
    for (const prop of requiredProps) {
      if (job[prop] === undefined || job[prop] === null) {
        throw new Error(`Job at index ${idx} (${job.title || 'untitled'}) is missing required property: ${prop}`);
      }
    }
  });
  console.log(`✓ jobs.json: ${jobsData.length} jobs validated successfully`);

  // 4. Check candidates
  if (!Array.isArray(candidatesData) || candidatesData.length < 4) {
    throw new Error('candidates.json must contain at least 4 demo profiles');
  }
  candidatesData.forEach((c, idx) => {
    if (!c.id || !c.name || !c.headline) {
      throw new Error(`Candidate at index ${idx} is missing id/name/headline`);
    }
  });
  console.log(`✓ candidates.json: ${candidatesData.length} candidate profiles validated`);

  // 5. Check plans & templates
  if (!plansData.creditPacks || !plansData.subscriptions) {
    throw new Error('plans.json missing creditPacks or subscriptions');
  }
  if (!templatesData.coverLetterTemplates || !templatesData.cvSummaryTemplates) {
    throw new Error('templates.json missing templates');
  }
  console.log('✓ plans.json and templates.json validated successfully');

  console.log('\nAll data files passed validation with 100% integrity!');
}

try {
  validate();
} catch (err) {
  console.error('Validation failed:', err.message);
  process.exit(1);
}
