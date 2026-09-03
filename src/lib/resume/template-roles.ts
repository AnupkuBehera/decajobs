export interface TemplateRole {
    slug: string;
    title: string;
    category: string;
    emoji: string;
    experienceLevel: string;
    atsScore: string;
    summary: string;
    topSkills: string[];
}

export const TEMPLATE_ROLES: TemplateRole[] = [
    {
        slug: "software-engineer",
        title: "Software Engineer",
        category: "Engineering",
        emoji: "💻",
        experienceLevel: "Junior to Senior",
        atsScore: "98%",
        summary:
            "Full-stack and backend software engineering template focusing on scalable system design, API performance, CI/CD pipelines, and modern stack (TypeScript, Python, React, Go).",
        topSkills: ["TypeScript / React", "Python / Node.js", "System Design", "Docker & Kubernetes", "PostgreSQL"],
    },
    {
        slug: "data-analyst",
        title: "Data Analyst & Scientist",
        category: "Data & AI",
        emoji: "📊",
        experienceLevel: "Entry to Lead",
        atsScore: "96%",
        summary:
            "Tailored for SQL querying, Power BI/Tableau dashboarding, statistical modeling, ETL pipelines, and business impact metrics.",
        topSkills: ["SQL & Window Functions", "Python (Pandas, Scikit-learn)", "Power BI / Tableau", "ETL Pipelines", "A/B Testing"],
    },
    {
        slug: "product-manager",
        title: "Product Manager",
        category: "Product & Management",
        emoji: "🚀",
        experienceLevel: "Associate to Director",
        atsScore: "97%",
        summary:
            "Designed to highlight customer discovery, roadmapping, PRD authoring, cross-functional engineering leadership, and North Star metric growth.",
        topSkills: ["Product Roadmapping", "User Story Mapping", "Agile & Scrum", "Data-Driven Prioritization", "Stakeholder Management"],
    },
    {
        slug: "devops-cloud-engineer",
        title: "DevOps & Cloud Engineer",
        category: "Infrastructure",
        emoji: "☁️",
        experienceLevel: "Mid to Senior",
        atsScore: "99%",
        summary:
            "Emphasizes cloud architectures (AWS/GCP/Azure), Infrastructure as Code (Terraform), Kubernetes orchestration, zero-downtime deployments, and uptime SLAs.",
        topSkills: ["Terraform / IaC", "Kubernetes & Docker", "AWS / GCP", "CI/CD (GitHub Actions)", "Prometheus & Grafana"],
    },
    {
        slug: "ui-ux-designer",
        title: "UI/UX & Product Designer",
        category: "Design",
        emoji: "🎨",
        experienceLevel: "All Levels",
        atsScore: "95%",
        summary:
            "Showcases design system architecture, Figma wireframing, usability testing metrics, accessibility compliance, and developer handoff.",
        topSkills: ["Figma & Design Systems", "User Research & Testing", "Wireframing & Prototyping", "Design Tokens", "WCAG Accessibility"],
    },
    {
        slug: "fresher-developer",
        title: "Fresher / College Graduate",
        category: "Early Career",
        emoji: "🎓",
        experienceLevel: "Entry Level / 0-1 Year",
        atsScore: "96%",
        summary:
            "Optimized for fresh graduates and career switchers without extensive formal work history. Highlights personal projects, hackathons, academic excellence, and core CS fundamentals.",
        topSkills: ["Data Structures & Algorithms", "Full-Stack Project Work", "Git & GitHub", "API Integration", "Problem Solving"],
    },
];
