/**
 * Resume Parser
 *
 * Extracts skills and job titles from uploaded PDF/DOCX resumes.
 * Uses pdf-parse for text extraction, then matches against a comprehensive
 * skills database to identify relevant skills the candidate has.
 */

// @ts-ignore
import pdf from "pdf-parse";

/**
 * Comprehensive list of skills to detect in resumes.
 * Grouped by category for better coverage.
 */
const SKILLS_DATABASE: string[] = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl",
  "Dart", "Elixir", "Clojure", "Haskell", "Lua", "Shell", "Bash",
  // Frontend
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML", "CSS",
  "Tailwind CSS", "Bootstrap", "SASS", "LESS", "jQuery", "Redux",
  "Webpack", "Vite", "Gatsby", "Nuxt.js", "Remix",
  // Backend
  "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot",
  "Ruby on Rails", "Laravel", "ASP.NET", "NestJS", "Koa", "Fastify",
  // Databases
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
  "DynamoDB", "Cassandra", "Oracle", "SQLite", "Firebase", "Supabase",
  "Neo4j", "CouchDB", "MariaDB",
  // Cloud & DevOps
  "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes",
  "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI",
  "CircleCI", "Nginx", "Apache", "Vercel", "Netlify", "Heroku",
  "CloudFormation", "Pulumi",
  // Data & ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Keras", "NLP",
  "Computer Vision", "Data Analysis", "Data Science", "Data Engineering",
  "Apache Spark", "Hadoop", "Airflow", "dbt", "Snowflake",
  "Tableau", "Power BI", "Looker", "Metabase",
  // Mobile
  "React Native", "Flutter", "iOS", "Android", "SwiftUI", "Jetpack Compose",
  "Xamarin", "Ionic",
  // Tools & Practices
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
  "Agile", "Scrum", "Kanban", "TDD", "BDD", "CI/CD",
  "REST API", "GraphQL", "gRPC", "WebSocket", "Microservices",
  "OAuth", "JWT", "SAML", "SSO",
  // Testing
  "Jest", "Cypress", "Playwright", "Selenium", "Mocha", "Pytest",
  "JUnit", "TestNG", "Vitest", "Testing Library",
  // Design & Product
  "Figma", "Sketch", "Adobe XD", "InVision", "Zeplin",
  "UI/UX", "Product Management", "User Research",
  // Other
  "Linux", "Windows Server", "Networking", "Security",
  "Blockchain", "Solidity", "Web3", "Ethereum",
  "SAP", "Salesforce", "HubSpot", "Shopify",
  "Excel", "VBA", "Google Sheets", "Airtable",
];

/**
 * Common job titles to detect in resumes.
 */
const TITLES_DATABASE: string[] = [
  "Software Engineer", "Senior Software Engineer", "Staff Engineer",
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Web Developer", "Mobile Developer", "iOS Developer", "Android Developer",
  "DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer",
  "Data Engineer", "Data Scientist", "Data Analyst", "Business Analyst",
  "Machine Learning Engineer", "AI Engineer", "ML Engineer",
  "Product Manager", "Technical Product Manager", "Project Manager",
  "Engineering Manager", "Tech Lead", "CTO", "VP Engineering",
  "UI/UX Designer", "Product Designer", "UX Researcher",
  "QA Engineer", "Test Engineer", "Automation Engineer",
  "Security Engineer", "Cybersecurity Analyst",
  "Solutions Architect", "Cloud Architect", "System Architect",
  "Database Administrator", "System Administrator",
  "Technical Writer", "Scrum Master",
];

export interface ParsedResume {
  extractedSkills: string[];
  extractedTitles: string[];
  rawText: string;
}

/**
 * Extracts text from a PDF file buffer.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

/**
 * Finds skills mentioned in the resume text.
 * Uses case-insensitive matching with word boundary awareness.
 */
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];

  for (const skill of SKILLS_DATABASE) {
    const lowerSkill = skill.toLowerCase();
    // Check if the skill appears in the text
    // Use includes for multi-word skills, word boundary for single-word
    if (lowerSkill.includes(" ") || lowerSkill.includes(".") || lowerSkill.includes("/")) {
      // Multi-word or dotted skills: simple includes check
      if (lowerText.includes(lowerSkill)) {
        foundSkills.push(skill);
      }
    } else {
      // Single-word skills: check with word boundary-like logic
      const regex = new RegExp(`\\b${escapeRegex(lowerSkill)}\\b`, "i");
      if (regex.test(text)) {
        foundSkills.push(skill);
      }
    }
  }

  return foundSkills;
}

/**
 * Finds job titles mentioned in the resume text.
 */
function extractTitles(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundTitles: string[] = [];

  for (const title of TITLES_DATABASE) {
    if (lowerText.includes(title.toLowerCase())) {
      foundTitles.push(title);
    }
  }

  return foundTitles;
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parses a resume file (PDF) and extracts skills and job titles.
 *
 * @param fileBuffer - The raw file bytes
 * @param mimeType - The file's MIME type
 * @returns Extracted skills and titles
 */
export async function parseResume(
  fileBuffer: Buffer,
  mimeType: string
): Promise<ParsedResume> {
  let text = "";

  if (mimeType === "application/pdf") {
    text = await extractTextFromPDF(fileBuffer);
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    // For DOCX, we'd need a docx parser. For now, treat as plain text extraction.
    // The pdf-parse library only handles PDFs.
    // A basic approach: try to extract any readable text from the buffer
    text = fileBuffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  if (!text.trim()) {
    return { extractedSkills: [], extractedTitles: [], rawText: "" };
  }

  const extractedSkills = extractSkills(text);
  const extractedTitles = extractTitles(text);

  console.log(
    `[Resume Parser] Extracted ${extractedSkills.length} skills and ${extractedTitles.length} titles`
  );

  return {
    extractedSkills,
    extractedTitles,
    rawText: text.slice(0, 5000), // Keep first 5000 chars for reference
  };
}
