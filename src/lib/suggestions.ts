/**
 * Predefined suggestion lists for profile fields.
 * Used to provide autocomplete/typeahead suggestions in the profile form.
 */

export const JOB_TITLE_SUGGESTIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Engineer",
  "Data Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "iOS Developer",
  "Android Developer",
  "Mobile Developer",
  "Product Manager",
  "Technical Product Manager",
  "Engineering Manager",
  "Tech Lead",
  "Solutions Architect",
  "Cloud Architect",
  "UI/UX Designer",
  "Product Designer",
  "QA Engineer",
  "Test Automation Engineer",
  "Security Engineer",
  "Cybersecurity Analyst",
  "Database Administrator",
  "System Administrator",
  "Network Engineer",
  "Blockchain Developer",
  "Game Developer",
  "Embedded Systems Engineer",
  "Technical Writer",
  "Scrum Master",
  "Business Analyst",
  "Data Analyst",
  "Project Manager",
  "IT Manager",
  "CTO",
  "VP of Engineering",
];

export const SKILL_SUGGESTIONS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express.js",
  "Django",
  "Flask",
  "Spring Boot",
  "Ruby on Rails",
  "Laravel",
  "ASP.NET",
  "GraphQL",
  "REST API",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "Elasticsearch",
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "Git",
  "Linux",
  "Agile",
  "Scrum",
  "TDD",
  "Microservices",
  "Machine Learning",
  "Deep Learning",
  "TensorFlow",
  "PyTorch",
  "NLP",
  "Computer Vision",
  "Data Analysis",
  "Tableau",
  "Power BI",
  "Figma",
  "Adobe XD",
  "Tailwind CSS",
  "SASS",
  "HTML/CSS",
  "Webpack",
  "Vite",
  "Jest",
  "Cypress",
  "Playwright",
  "React Native",
  "Flutter",
  "Firebase",
  "Supabase",
  "Prisma",
  "OAuth",
  "JWT",
  "WebSocket",
  "gRPC",
  "Kafka",
  "RabbitMQ",
  "Solidity",
  "Web3",
];

export const LOCATION_SUGGESTIONS = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Seattle, WA",
  "Austin, TX",
  "Chicago, IL",
  "Boston, MA",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Portland, OR",
  "San Diego, CA",
  "Dallas, TX",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "Minneapolis, MN",
  "Raleigh, NC",
  "Salt Lake City, UT",
  "Nashville, TN",
  "Washington, DC",
  "San Jose, CA",
  "Charlotte, NC",
  "Columbus, OH",
  "Indianapolis, IN",
  "Detroit, MI",
  "London, UK",
  "Berlin, Germany",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Sydney, Australia",
  "Singapore",
  "Bangalore, India",
  "Dublin, Ireland",
  "Amsterdam, Netherlands",
];

/**
 * Filters suggestions based on user input.
 * Returns top matches that start with or contain the query.
 */
export function filterSuggestions(
  query: string,
  suggestions: string[],
  excludeItems: string[] = [],
  maxResults: number = 8
): string[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const excludeSet = new Set(excludeItems.map((item) => item.toLowerCase()));

  const startsWithMatches: string[] = [];
  const containsMatches: string[] = [];

  for (const suggestion of suggestions) {
    if (excludeSet.has(suggestion.toLowerCase())) continue;

    const lowerSuggestion = suggestion.toLowerCase();
    if (lowerSuggestion.startsWith(lowerQuery)) {
      startsWithMatches.push(suggestion);
    } else if (lowerSuggestion.includes(lowerQuery)) {
      containsMatches.push(suggestion);
    }
  }

  return [...startsWithMatches, ...containsMatches].slice(0, maxResults);
}
