/**
 * Public Jobs Data Layer
 *
 * Powers the public, indexable job board (/jobs, /jobs/[slug], /jobs/remote,
 * /jobs/category/[category], /jobs/location/[city]) using free, keyless job
 * APIs (Remotive, RemoteOK, Arbeitnow). This gives Google unique, fresh,
 * crawlable content — a key AdSense "low value content" quality signal.
 *
 * All fetches are wrapped in try/catch and return empty arrays on failure so
 * pages always render with graceful fallback editorial content.
 */

import type { ExternalJob } from "@/lib/external-jobs/types";
import { fetchRemotiveJobs } from "@/lib/external-jobs/remotive";
import { fetchRemoteOKJobs } from "@/lib/external-jobs/remoteok";
import { fetchArbeitnowJobs } from "@/lib/external-jobs/arbeitnow";

export type { ExternalJob } from "@/lib/external-jobs/types";

/** How long to cache fetched job lists (seconds). 1 hour = fresh but stable. */
export const PUBLIC_JOBS_REVALIDATE = 3600;

/** Maximum number of public job listings to render per page. */
export const MAX_JOBS_PER_PAGE = 50;

/* ─────────────────────────── Category taxonomy ─────────────────────────── */

export interface JobCategory {
    slug: string;
    name: string;
    emoji: string;
    keywords: string[];
    intro: string;
    salaryRange: { junior: string; mid: string; senior: string };
    topSkills: string[];
    marketOutlook: string;
    careers: { title: string; text: string }[];
    faqs: { q: string; a: string }[];
}

export const JOB_CATEGORIES: JobCategory[] = [
    {
        slug: "software-engineering",
        name: "Software Engineering",
        emoji: "💻",
        keywords: ["software", "developer", "engineer", "full stack", "fullstack", "frontend", "front-end", "backend", "back-end", "programmer", "coding", "java", "python", "javascript", "typescript", "react", "node", "golang", "ruby", "php", "c++", ".net", "swift", "kotlin"],
        intro:
            "Software engineering remains one of the highest-demand careers in 2026. From full-stack web developers to backend platform engineers, companies around the world are hiring for roles that build and maintain the digital products powering the modern global economy.",
        salaryRange: {
            junior: "₹4.5L - ₹8.5L / $65,000",
            mid: "₹12L - ₹24L / $115,000",
            senior: "₹26L - ₹55L+ / $165,000+",
        },
        topSkills: ["TypeScript / JavaScript", "Python & AI Integration", "React / Next.js", "Node.js & Go", "PostgreSQL & Redis", "System Design & Microservices", "Docker & CI/CD"],
        marketOutlook:
            "Demand for software engineers in 2026 has evolved toward AI-assisted development, high-throughput microservices, and full-stack autonomy. Engineers who pair core algorithms with modern web frameworks and AI APIs are commanding top-tier packages across both Indian IT hubs and US/EU remote teams.",
        careers: [
            { title: "Frontend Developer", text: "Build user interfaces with React, Vue, or Angular. Pair design with engineering to create fast, accessible, and delightful web experiences." },
            { title: "Backend Engineer", text: "Design APIs, databases, and server-side systems that keep applications reliable, secure, and scalable under heavy load." },
            { title: "Full-Stack Developer", text: "Own features end-to-end — from the database schema to the pixels on screen. The most versatile role in modern product teams." },
            { title: "DevOps / Platform Engineer", text: "Automate infrastructure with Docker, Kubernetes, and CI/CD pipelines so teams can ship software quickly and safely." },
        ],
        faqs: [
            {
                q: "What skills are most in demand for Software Engineers in 2026?",
                a: "Full-stack proficiency (TypeScript, React/Next.js, Node.js or Python), cloud infrastructure knowledge (AWS/GCP), and experience incorporating AI tools or APIs into production applications are the top skills recruiters look for."
            },
            {
                q: "How can freshers land their first software engineering job?",
                a: "Build 2-3 full-stack projects showcasing real API integrations and database persistence. Publish your clean code on GitHub, write a targeted ATS-optimized resume using DecaJobs, and practice core data structures and algorithm interview questions."
            },
            {
                q: "What is the difference between Frontend, Backend, and Full-Stack roles?",
                a: "Frontend focuses on browser client interfaces (HTML/CSS/JS/React). Backend handles server logic, databases, and system architecture. Full-Stack developers bridges both tiers to deliver complete user-facing product features."
            },
            {
                q: "Are remote software engineering jobs still available for international candidates?",
                a: "Yes! Thousands of US, European, and Asian companies actively hire remote software engineers in India and worldwide. DecaJobs aggregates hundreds of verified remote developer listings daily."
            }
        ],
    },
    {
        slug: "data-analytics",
        name: "Data & Analytics",
        emoji: "📊",
        keywords: ["data", "analyst", "analytics", "scientist", "machine learning", "ml", "ai", "business intelligence", "bi", "sql", "python", "tableau", "power bi", "databricks", "spark", "etl"],
        intro:
            "Every enterprise is now a data-driven enterprise. Data analysts, scientists, and machine learning engineers transform raw unstructured data into strategic decisions, predictive models, and intelligent products — making analytics one of the fastest-growing fields in 2026.",
        salaryRange: {
            junior: "₹4.0L - ₹7.5L / $60,000",
            mid: "₹10L - ₹20L / $105,000",
            senior: "₹24L - ₹48L+ / $150,000+",
        },
        topSkills: ["Advanced SQL & Window Functions", "Python (Pandas, NumPy, Scikit-learn)", "Power BI & Tableau", "Data Warehousing (Snowflake/BigQuery)", "Machine Learning & Prompt Engineering", "ETL / ELT Pipelines"],
        marketOutlook:
            "The data landscape in 2026 prioritizes real-time analytics, automated data pipelines, and practical machine learning implementation over static reporting. Organizations are seeking data specialists who can translate complex data models into actionable business outcomes.",
        careers: [
            { title: "Data Analyst", text: "Query, clean, and visualize data to answer business questions. SQL, Excel, and dashboarding tools (Power BI/Tableau) are your core toolkit." },
            { title: "Data Scientist", text: "Apply statistics and machine learning to predict outcomes, segment users, and surface deep insights that drive executive strategy." },
            { title: "Machine Learning Engineer", text: "Productionize ML models — train, deploy, and monitor scalable AI systems in live applications." },
            { title: "Business Intelligence Developer", text: "Design the semantic layers, data models, and automated executive dashboards that leadership relies on for operational planning." },
        ],
        faqs: [
            {
                q: "What is the single most important skill for a Data Analyst?",
                a: "SQL (Structured Query Language). Being able to write complex queries, joins, aggregations, and window functions to pull accurate datasets from large databases is fundamental to every data role."
            },
            {
                q: "What tools should I master to transition into Data Science?",
                a: "Start with Python (Pandas, NumPy, Matplotlib), SQL, statistical analysis, and basic machine learning concepts. Familiarity with cloud platforms (GCP, AWS) and data warehouses like Snowflake is highly beneficial."
            },
            {
                q: "How does AI affect data analytics jobs?",
                a: "AI automates routine boilerplate code, but increases demand for analysts who can validate AI outputs, interpret complex statistical models, and communicate narrative business insights to stakeholders."
            }
        ],
    },
    {
        slug: "product-design",
        name: "Product & Design",
        emoji: "🎨",
        keywords: ["product manager", "product owner", "ux", "ui", "designer", "design", "research", "figma", "product"],
        intro:
            "Exceptional digital products require practitioners who blend user empathy, strategic thinking, and visual polish. Product managers shape the product vision, while UX/UI designers transform complex workflows into intuitive, beautiful experiences.",
        salaryRange: {
            junior: "₹4.0L - ₹8.0L / $55,000",
            mid: "₹11L - ₹22L / $100,000",
            senior: "₹25L - ₹50L+ / $145,000+",
        },
        topSkills: ["Figma & Design Systems", "User Research & Usability Testing", "Wireframing & Interactive Prototyping", "Product Roadmap & Strategy", "Data-Informed Product Analytics", "Agile & Scrum Methodologies"],
        marketOutlook:
            "Design and Product roles in 2026 place heavy emphasis on micro-interactions, accessibility standards (WCAG 2.1), design systems, and rapid prototyping with AI tools. Strong Product Designers who understand both user research and business metrics are heavily sought after.",
        careers: [
            { title: "Product Manager", text: "Own the product roadmap and feature strategy. Prioritize requirements based on customer research, data insights, and business growth targets." },
            { title: "UX Designer", text: "Conduct user research, map user journeys, and design wireframes and interactive prototypes that make digital products intuitive and effortless." },
            { title: "UI Designer", text: "Craft the visual identity — typography, color palettes, micro-animations, and component libraries — that give software products a polished look." },
            { title: "Product Designer", text: "A holistic role combining user research, interaction design, and visual craft to ship end-to-end product features." },
        ],
        faqs: [
            {
                q: "Do I need a formal design degree to become a UX/UI Designer?",
                a: "No. A strong portfolio demonstrating your design process, user research, wireframes, and polished Figma prototypes is the primary hiring criterion for design recruiters."
            },
            {
                q: "How do Product Managers collaborate with Product Designers?",
                a: "PMs define the problem statement, user goal, and business success metrics, while Designers lead the solution research, user flows, and interface execution. They work iteratively with engineering to ship features."
            }
        ],
    },
    {
        slug: "marketing-sales",
        name: "Marketing & Sales",
        emoji: "📣",
        keywords: ["marketing", "sales", "growth", "seo", "content", "social media", "digital marketing", "account executive", "account manager", "bdm", "business development", "customer success", "affiliate", "ppc", "brand"],
        intro:
            "Marketing and sales professionals drive top-line revenue growth. From organic growth specialists and performance marketers to enterprise account executives, these roles blend creative storytelling, data analytics, and relationship management.",
        salaryRange: {
            junior: "₹3.5L - ₹6.5L / $45,000",
            mid: "₹8.5L - ₹18L / $85,000",
            senior: "₹20L - ₹42L+ / $135,000+",
        },
        topSkills: ["SEO & Content Strategy", "Performance Marketing (Google & Meta Ads)", "B2B Sales & Pipeline Management", "Customer Acquisition & Funnel Analytics", "CRM Tools (Salesforce, HubSpot)", "Email Marketing & Automation"],
        marketOutlook:
            "Revenue roles in 2026 rely heavily on multi-channel attribution, AI content optimization, and consultative enterprise selling. Marketers with strong analytical skills and salespeople who build authentic buyer trust command high performance bonuses and OTE packages.",
        careers: [
            { title: "Digital Marketing Specialist", text: "Plan and execute targeted campaigns across search, social media, and email channels. Track CAC, ROAS, and funnel conversion metrics." },
            { title: "SEO Specialist", text: "Expand organic traffic through technical SEO audits, high-intent content strategy, and authoritative backlink acquisition." },
            { title: "Account Executive", text: "Lead the full sales cycle from initial discovery call to contract close. Build qualified pipelines and negotiate win-win client agreements." },
            { title: "Customer Success Manager", text: "Ensure client retention and account expansion by helping customers achieve measurable success with your product or service." },
        ],
        faqs: [
            {
                q: "What is the difference between Inbound and Outbound Marketing?",
                a: "Inbound attracts potential buyers naturally through SEO, valuable content, and social media. Outbound reaches out directly to prospective leads via paid ads, cold email, and sales prospecting."
            },
            {
                q: "What metrics are most critical for digital marketers?",
                a: "CAC (Customer Acquisition Cost), Conversion Rate, ROAS (Return on Ad Spend), LTV (Lifetime Value), and Organic Keyword Rankings."
            }
        ],
    },
    {
        slug: "devops-cloud",
        name: "DevOps & Cloud",
        emoji: "☁️",
        keywords: ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "docker", "sre", "site reliability", "infrastructure", "terraform", "linux", "sysadmin", "networking"],
        intro:
            "DevOps and Cloud specialists build the secure, resilient foundation of modern cloud-native applications. As enterprises scale multi-cloud infrastructure, SREs and Platform Engineers ensure zero-downtime reliability and rapid automated deployments.",
        salaryRange: {
            junior: "₹5.0L - ₹9.0L / $70,000",
            mid: "₹14L - ₹28L / $125,000",
            senior: "₹30L - ₹60L+ / $175,000+",
        },
        topSkills: ["AWS / Azure / GCP Cloud", "Kubernetes & Docker Containerization", "Terraform & IaC", "CI/CD (GitHub Actions, GitLab CI)", "Linux System Administration", "Observability (Prometheus, Grafana, Datadog)"],
        marketOutlook:
            "Cloud automation and Site Reliability Engineering remain among the highest-paid specializations in software. As infrastructure moves toward automated IaC and container orchestration, skilled DevOps engineers are in massive demand globally.",
        careers: [
            { title: "DevOps Engineer", text: "Build automated CI/CD pipelines, manage infrastructure code, and eliminate manual deployment bottlenecks." },
            { title: "Site Reliability Engineer (SRE)", text: "Combine software development with IT operations to maintain high system availability, low latency, and comprehensive logging." },
            { title: "Cloud Architect", text: "Architect cost-effective, multi-region cloud infrastructures adhering to strict security and disaster recovery standards." },
            { title: "Platform Engineer", text: "Develop internal developer platforms (IDPs) that empower product engineering teams to deploy services independently." },
        ],
        faqs: [
            {
                q: "What cloud certifications are most valuable in 2026?",
                a: "AWS Certified Solutions Architect, Certified Kubernetes Administrator (CKA), and Terraform Associate are widely recognized certifications by hiring managers."
            },
            {
                q: "How does DevOps differ from Site Reliability Engineering (SRE)?",
                a: "DevOps is a operational cultural methodology emphasizing continuous integration and deployment automation. SRE is a specific engineering implementation created by Google that applies software practices to solve infrastructure and reliability challenges."
            }
        ],
    },
    {
        slug: "human-resources",
        name: "Human Resources",
        emoji: "🤝",
        keywords: ["hr", "human resources", "recruiter", "recruiting", "talent", "people", "operations", "onboarding", "payroll"],
        intro:
            "Human Resources and Talent Acquisition professionals shape organizational culture and recruit top-tier talent. As hybrid workplaces and international hiring expand, strategic HR roles are essential for driving employee engagement and business retention.",
        salaryRange: {
            junior: "₹3.5L - ₹6.0L / $45,000",
            mid: "₹8.0L - ₹16L / $80,000",
            senior: "₹18L - ₹38L+ / $120,000+",
        },
        topSkills: ["Talent Sourcing & Screening", "HR Information Systems (HRIS)", "Employee Engagement & Retention", "Compensation & Benefits Architecture", "Performance Management Systems", "Employment Law & Labor Compliance"],
        marketOutlook:
            "Modern HR focuses heavily on talent analytics, employer branding, and streamlined candidate experiences. Technical recruiters and HR Business Partners who leverage AI sourcing tools are highly valued by fast-growing startups and enterprises.",
        careers: [
            { title: "Recruiter / Talent Partner", text: "Identify, engage, and evaluate top candidates across channels to fill open roles efficiently." },
            { title: "HR Business Partner (HRBP)", text: "Align talent management strategy directly with executive business goals, leadership development, and team scaling." },
            { title: "Talent Acquisition Manager", text: "Lead recruiting teams, establish hiring workflows, analyze hiring velocity metrics, and manage external agency relationships." },
            { title: "People Operations Specialist", text: "Manage core operational systems: onboarding, employee benefits administration, HR compliance, and workplace policies." },
        ],
        faqs: [
            {
                q: "What tools do modern recruiters use for candidate sourcing?",
                a: "LinkedIn Recruiter, Applicant Tracking Systems (Greenhouse, Lever, Workday), AI candidate matching tools like DecaJobs, and automated scheduling tools."
            }
        ],
    },
    {
        slug: "finance-accounting",
        name: "Finance & Accounting",
        emoji: "💰",
        keywords: ["finance", "accountant", "accounting", "financial analyst", "fp&a", "audit", "tax", "bookkeeping", "controller", "investment", "payments"],
        intro:
            "Finance and Accounting professionals maintain fiscal health, regulatory compliance, and strategic capital allocation. From financial planning and analysis (FP&A) to corporate treasury, these roles guide sound corporate growth.",
        salaryRange: {
            junior: "₹4.0L - ₹7.0L / $50,000",
            mid: "₹9.5L - ₹19L / $95,000",
            senior: "₹22L - ₹45L+ / $140,000+",
        },
        topSkills: ["Financial Modeling & Forecasting", "SQL & Advanced Financial Excel", "IFRS & GAAP Accounting Standards", "ERP Systems (SAP, NetSuite, Tally)", "Taxation & Regulatory Audit", "FP&A & Corporate Valuation"],
        marketOutlook:
            "Financial roles in 2026 combine classic accounting precision with data analytics (Python, SQL). Companies place high value on FP&A professionals who can model complex market scenarios and guide strategic investment decisions.",
        careers: [
            { title: "Financial Analyst", text: "Build detailed financial models, revenue forecasts, and investment appraisals to guide pricing and strategic growth." },
            { title: "Corporate Accountant", text: "Maintain accurate general ledgers, oversee period-end closing, and ensure strict compliance with GAAP/IFRS standards." },
            { title: "FP&A Manager", text: "Lead corporate budgeting, variance analysis, and management reporting for executive decision-makers." },
            { title: "Financial Controller", text: "Direct overall accounting operations, internal controls, tax compliance, and financial reporting across the enterprise." },
        ],
        faqs: [
            {
                q: "What certifications boost a finance career in India & globally?",
                a: "CA (Chartered Accountant) in India, CPA (Certified Public Accountant), CFA (Chartered Financial Analyst), and CMA (Certified Management Accountant) are top professional designations."
            }
        ],
    },
    {
        slug: "customer-support",
        name: "Customer Support",
        emoji: "🎧",
        keywords: ["support", "customer service", "helpdesk", "help desk", "technical support", "success", "operations", "agent", "analyst support"],
        intro:
            "Customer Support and Success teams serve as the direct link between users and software products. High-performing support teams resolve complex issues, advocate for user needs, and drive customer retention.",
        salaryRange: {
            junior: "₹3.0L - ₹5.5L / $40,000",
            mid: "₹6.5L - ₹14L / $75,000",
            senior: "₹15L - ₹30L+ / $115,000+",
        },
        topSkills: ["Technical Troubleshooting & APIs", "Zendesk / Freshdesk / Salesforce Service", "Product Knowledge & Documentation", "SLA & Ticket Resolution Management", "Empathy & Written Communication", "Customer Churn Reduction"],
        marketOutlook:
            "As AI handles basic tier-1 queries, Tier-2 and Technical Support Engineers who can inspect browser logs, query database records, and guide users through complex workflows are increasingly crucial for tech companies.",
        careers: [
            { title: "Customer Support Specialist", text: "Assist customers via live chat, ticket queues, and email with clear, helpful, and empathetic guidance." },
            { title: "Technical Support Engineer", text: "Investigate software bugs, verify API responses, and partner with engineering teams to resolve technical product escalations." },
            { title: "Support Operations Lead", text: "Manage support queues, monitor customer satisfaction (CSAT) scores, and optimize support team workflows." },
            { title: "Customer Success Specialist", text: "Guide client onboarding, drive feature adoption, and conduct regular account health checks to prevent customer churn." },
        ],
        faqs: [
            {
                q: "What skills are needed for Technical Support vs Standard Support?",
                a: "Technical Support requires basic coding knowledge (HTML, CSS, JSON, SQL), API troubleshooting (Postman), log analysis, and deep product architecture understanding."
            }
        ],
    },
];

export function getCategoryBySlug(slug: string): JobCategory | undefined {
    return JOB_CATEGORIES.find((c) => c.slug === slug);
}

/* ────────────────────────────── Locations ──────────────────────────────── */

export interface CityInfo {
    slug: string;
    name: string;
    aliases: string[];
    blurb: string;
    techParks: string[];
    salaryInsight: string;
    topIndustries: string[];
    costOfLiving: string;
    faqs: { q: string; a: string }[];
}

export const CITIES: CityInfo[] = [
    {
        slug: "bangalore",
        name: "Bangalore",
        aliases: ["bangalore", "bengaluru", "blr"],
        blurb:
            "Bangalore (Bengaluru) is India's Silicon Valley — home to thousands of tech startups, Fortune 500 Global Capability Centers (GCCs), and unicorn product companies. From full-stack engineering to AI research, the city offers India's highest tech salary benchmarks.",
        techParks: ["Manyata Tech Park (Thanisandra)", "Electronic City Phase 1 & 2", "ITPL (International Tech Park, Whitefield)", "Bagmane Tech Park (CV Raman Nagar)", "Embassy TechVillage (Outer Ring Road)"],
        salaryInsight: "Software Engineers in Bangalore earn an average of ₹8L to ₹28L+ per annum depending on experience, with senior product talent commanding ₹45L+.",
        topIndustries: ["SaaS & Enterprise Software", "Fintech & Digital Payments", "E-commerce & Logistics", "AI & Deep Tech Startups", "Global Capability Centers (GCCs)"],
        costOfLiving: "Moderate-High. Rent in tech corridors (Indiranagar, HSR Layout, Bellandur) ranges from ₹20,000 to ₹45,000/month for 1BHK/2BHK apartments.",
        faqs: [
            {
                q: "Why is Bangalore called the Silicon Valley of India?",
                a: "Bangalore hosts over 40% of India's IT export services, hundreds of R&D innovation centers, major tech giants (Google, Microsoft, Amazon, Infosys), and the highest concentration of venture-backed startups."
            },
            {
                q: "What are the best areas to live in Bangalore for tech professionals?",
                a: "HSR Layout, Koramangala, Indiranagar, Bellandur, Whitefield, and Sarjapur Road offer close proximity to major tech parks and vibrant developer communities."
            }
        ],
    },
    {
        slug: "mumbai",
        name: "Mumbai",
        aliases: ["mumbai", "bombay"],
        blurb:
            "Mumbai is India's financial capital and media powerhouse. Leading banks, fintech unicorns, management consultancies, and digital agencies cluster here, offering high-impact roles in finance, technology, marketing, and corporate strategy.",
        techParks: ["Mindspace IT Park (Malad & Airoli)", "Bandram Kurla Complex (BKC)", "Hiranandani Business Park (Powai)", "Infinity IT Park (Dindoshi)"],
        salaryInsight: "Finance and Tech professionals in Mumbai earn competitive packages ranging from ₹7L to ₹25L per annum, with investment banking and senior leadership roles exceeding ₹50L.",
        topIndustries: ["Banking & Financial Services (BFSI)", "Fintech & Payments", "Media & Entertainment", "Management Consulting", "Healthcare & Pharma"],
        costOfLiving: "High. Residential rent in Powai, Bandra, or Malad ranges from ₹30,000 to ₹65,000/month.",
        faqs: [
            {
                q: "What kinds of tech jobs are most common in Mumbai?",
                a: "Fintech engineering, quantitative finance analysis, core banking technology, media-tech product design, and digital performance marketing."
            }
        ],
    },
    {
        slug: "delhi",
        name: "Delhi NCR",
        aliases: ["delhi", "ncr", "gurgaon", "gurugram", "noida", "new delhi"],
        blurb:
            "Delhi NCR — encompassing Gurugram, Noida, and New Delhi — is a massive commercial and technology hub. It hosts corporate headquarters, e-commerce giants, consultancies, and rapidly expanding tech corridors.",
        techParks: ["Cyber City & Cyber Hub (Gurugram)", "Golf Course Extension Road (Gurugram)", "Noida Sector 62 & 125 Tech Hubs", "Udyog Vihar (Gurugram)"],
        salaryInsight: "Average software and marketing packages range from ₹6.5L to ₹24L, with senior product managers and tech leads earning ₹35L - ₹50L+.",
        topIndustries: ["E-Commerce & Quick Commerce", "B2B SaaS & Enterprise Tech", "Consumer Internet Startups", "Management Consulting & Analytics", "Telecom & Infrastructure"],
        costOfLiving: "Moderate-High. Rent in Gurgaon/Noida sectors ranges from ₹18,000 to ₹40,000/month.",
        faqs: [
            {
                q: "What is the difference between job opportunities in Gurgaon vs Noida?",
                a: "Gurgaon is heavily focused on corporate headquarters, B2B SaaS, management consulting, and fintech startups. Noida has a strong concentration of IT services, electronic manufacturing, media tech, and software development centers."
            }
        ],
    },
    {
        slug: "hyderabad",
        name: "Hyderabad",
        aliases: ["hyderabad", "hitech", "gachibowli"],
        blurb:
            "Hyderabad is a premier global technology and life sciences destination. Featuring world-class infrastructure in HITEC City and Gachibowli, the city hosts major campuses for Microsoft, Google, Amazon, Meta, and leading IT services firms.",
        techParks: ["HITEC City (Cyberabad)", "Gachibowli Financial District", "Mindspace Cyberabad", "Raheja Mindspace IT Park", "Nanakramguda IT Zone"],
        salaryInsight: "Tech salaries in Hyderabad closely mirror Bangalore, ranging from ₹7L to ₹26L annually for mid-level software engineers.",
        topIndustries: ["Cloud & Platform Infrastructure", "Enterprise IT Services", "Pharmaceuticals & Biotechnology", "Global Capability Centers (GCCs)", "Gaming & Animation"],
        costOfLiving: "Moderate. Rent in Gachibowli, Madhapur, and Kondapur ranges from ₹16,000 to ₹32,000/month, offering excellent quality of life.",
        faqs: [
            {
                q: "Why is Hyderabad popular among IT professionals?",
                a: "Hyderabad offers modern infrastructure, lower cost of living compared to Bangalore and Mumbai, excellent connectivity, and massive technology campuses for top Fortune 500 firms."
            }
        ],
    },
    {
        slug: "chennai",
        name: "Chennai",
        aliases: ["chennai", "madras"],
        blurb:
            "Chennai is a major software engineering, SaaS, automotive, and financial services hub. Dubbed the 'SaaS Capital of India' due to pioneers like Zoho and Freshworks, Chennai offers stable, long-term tech career paths.",
        techParks: ["OMR (Old Mahabalipuram Road Tech Corridor)", "DLF IT Park (Porur)", "Ramanujan IT City (Taramani)", "TIDEL Park (Taramani)"],
        salaryInsight: "Software and SaaS professionals earn average packages from ₹5.5L to ₹20L per annum, with low employee turnover and high job security.",
        topIndustries: ["B2B SaaS & Product Software", "IT & Telecom Services", "Automotive & Industrial Tech", "BFSI Operations", "Healthcare IT"],
        costOfLiving: "Moderate. Rent along OMR and Velachery ranges from ₹14,000 to ₹28,000/month.",
        faqs: [
            {
                q: "Why is Chennai known as the SaaS hub of India?",
                a: "Chennai birthed global SaaS leaders like Zoho and Freshworks, creating a deep ecosystem of SaaS product managers, software engineers, and global customer success talent."
            }
        ],
    },
    {
        slug: "pune",
        name: "Pune",
        aliases: ["pune", "puna"],
        blurb:
            "Pune is a thriving technology, automotive, and education city. Known for its pleasant climate, engineering institutions, and massive IT parks in Hinjewadi and Kharadi, Pune is a top choice for developers and analysts.",
        techParks: ["Rajiv Gandhi Infotech Park (Hinjewadi Phase 1, 2, 3)", "EON Free Zone (Kharadi)", "Cybercity Magarpatta", "Commerzone (Yerwada)"],
        salaryInsight: "Software engineers and DevOps specialists earn average salaries ranging from ₹6L to ₹22L per annum.",
        topIndustries: ["Automotive & Mobility Tech", "Enterprise IT Services", "Product Engineering", "Fintech & Insurance Tech", "Embedded Systems & IoT"],
        costOfLiving: "Moderate. Rent in Wakad, Hinjewadi, Kharadi, and Baner ranges from ₹15,000 to ₹30,000/month.",
        faqs: [
            {
                q: "What makes Pune attractive for software professionals?",
                a: "Proximity to Mumbai, top engineering colleges, major IT parks in Hinjewadi and Kharadi, and a vibrant work-life balance."
            }
        ],
    },
    {
        slug: "london",
        name: "London",
        aliases: ["london", "uk", "united kingdom", "greater london"],
        blurb:
            "London is Europe's leading tech capital and global financial hub. Home to world-class fintech, AI labs (like Google DeepMind), and thousands of venture-backed scaleups, London offers Europe's highest software engineering packages.",
        techParks: ["Silicon Roundabout (Old Street)", "King's Cross Knowledge Quarter", "Canary Wharf Financial District", "Paddington Tech Cluster"],
        salaryInsight: "Software Engineers in London earn £65,000 to £120,000+ per year, with senior fintech architects commanding £150,000+.",
        topIndustries: ["Fintech & Banking Technology", "Artificial Intelligence & Deep Tech", "E-Commerce & Digital Marketplaces", "Cybersecurity & Regtech"],
        costOfLiving: "High. Monthly rent for 1-bedroom apartments in Zones 1-3 ranges from £1,800 to £2,600.",
        faqs: [
            {
                q: "Why is London a premier global tech destination?",
                a: "London combines access to global capital, top universities, a vibrant startup ecosystem, and European headquarters for Google, Meta, and Stripe."
            }
        ],
    },
    {
        slug: "berlin",
        name: "Berlin",
        aliases: ["berlin", "germany", "deutschland"],
        blurb:
            "Berlin is Germany's tech powerhouse and Europe's startup capital. Known for its international English-first developer community, vibrant cultural scene, and deep venture funding in mobility, fintech, and climate tech.",
        techParks: ["Silicon Allee (Mitte)", "Kreuzberg Tech District", "Adlershof Technology Park", "Factory Berlin Hub"],
        salaryInsight: "Developers in Berlin earn an average of €60,000 to €105,000 annually, with senior and lead engineers reaching €125,000+.",
        topIndustries: ["SaaS & B2B Platforms", "Fintech & Insurtech", "Mobility & CleanTech", "Creative Tech & E-Commerce"],
        costOfLiving: "Moderate. Monthly apartment rent ranges from €1,000 to €1,800.",
        faqs: [
            {
                q: "Do I need to speak German to work in tech in Berlin?",
                a: "Most startups and international tech firms in Berlin operate entirely in English. However, conversational German is helpful for administrative tasks."
            }
        ],
    },
    {
        slug: "madrid",
        name: "Madrid",
        aliases: ["madrid", "spain", "españa"],
        blurb:
            "Madrid is the bustling heart of Spain's tech ecosystem and the bridge to Latin American markets. The city boasts rapid growth in software development, cloud computing, and telecommunications.",
        techParks: ["Madrid Tech City", "La Nave Innovation Center", "Parque Tecnológico de Leganés", "Chamartín Business Zone"],
        salaryInsight: "Software Engineers in Madrid earn between €38,000 and €75,000+ per year, with remote international contracts offering even higher compensation.",
        topIndustries: ["Telecommunications & Cloud", "Fintech & Payments", "TravelTech & Hospitality", "Renewable Energy & IoT"],
        costOfLiving: "Moderate. Monthly rent for central apartments ranges from €900 to €1,600.",
        faqs: [
            {
                q: "How is Madrid's tech job market evolving?",
                a: "Madrid has rapidly emerged as a European tech hub with competitive salaries, high quality of life, and growing international R&D hubs for companies like Amazon, Google, and Microsoft."
            }
        ],
    },
    {
        slug: "paris",
        name: "Paris",
        aliases: ["paris", "france", "ile-de-france"],
        blurb:
            "Paris is Europe's premier AI and deep tech hotspot, home to Station F (the world's largest startup campus) and leading generative AI innovators like Mistral AI and Hugging Face.",
        techParks: ["Station F (13th Arrondissement)", "Silicon Sentier", "Paris-Saclay Innovation Cluster", "La Défense Business District"],
        salaryInsight: "Tech professionals in Paris earn an average of €50,000 to €95,000 per year, with AI researchers and senior engineering leads commanding €120,000+.",
        topIndustries: ["Artificial Intelligence & Machine Learning", "Luxury-Tech & E-Commerce", "Fintech & SaaS", "Biotech & HealthTech"],
        costOfLiving: "High. Monthly apartment rent ranges from €1,200 to €2,200.",
        faqs: [
            {
                q: "Why is Paris called the AI capital of Europe?",
                a: "With top mathematical institutions, research universities, and government support, Paris hosts leading AI laboratories for Meta, Google, and groundbreaking startups like Mistral AI."
            }
        ],
    },
    {
        slug: "tokyo",
        name: "Tokyo",
        aliases: ["tokyo", "japan", "shibuya", "roppongi", "nihon", "日本"],
        blurb:
            "Tokyo is Asia's innovation giant, combining cutting-edge robotics, gaming, consumer internet, and enterprise software. A rapidly growing number of international tech companies offer bilingual and English-friendly engineering roles.",
        techParks: ["Shibuya Bit Valley", "Roppongi Hills Tech District", "Shinagawa Tech Corridor", "Otemachi Financial & Fintech Hub"],
        salaryInsight: "Software Engineers in Tokyo earn ¥6.5M to ¥14M+ (approx. $45,000 to $100,000+ USD), with foreign tech firms paying competitive international rates.",
        topIndustries: ["Gaming & Interactive Entertainment", "Robotics & Hardware-Software Systems", "Fintech & Mobile Payments", "Enterprise DX (Digital Transformation)"],
        costOfLiving: "Moderate-High. Monthly rent in central wards ranges from ¥100,000 to ¥220,000.",
        faqs: [
            {
                q: "Can foreign engineers find jobs in Tokyo without fluent Japanese?",
                a: "Yes, many tech unicorns (Mercari, Rakuten, LINE) and global companies hire bilingual and English-speaking software engineers and product managers."
            }
        ],
    },
    {
        slug: "sao-paulo",
        name: "São Paulo",
        aliases: ["sao paulo", "são paulo", "brazil", "brasil", "sp"],
        blurb:
            "São Paulo is the financial and tech capital of Latin America, producing more tech unicorns than any other city in the Southern Hemisphere. Major hubs in Faria Lima and Pinheiros drive fintech, SaaS, and e-commerce innovation.",
        techParks: ["Faria Lima Financial & Tech Corridor", "Pinheiros Innovation District", "Berrini Tech Center", "Cubo Itaú Tech Hub"],
        salaryInsight: "Software Engineers in São Paulo earn R$90,000 to R$220,000+ per year, with senior engineers working for US remote employers earning up to $60,000+ USD.",
        topIndustries: ["Fintech & Digital Banking (Nubank, etc.)", "E-Commerce & Logistics", "AgriTech & BioTech", "B2B SaaS"],
        costOfLiving: "Moderate. Monthly apartment rent in safe tech districts ranges from R$2,500 to R$5,500.",
        faqs: [
            {
                q: "Why is São Paulo considered the Silicon Valley of Latin America?",
                a: "São Paulo accounts for over 60% of venture capital invested in Brazil and hosts the headquarters of Latin America's largest tech scaleups."
            }
        ],
    },
    {
        slug: "seoul",
        name: "Seoul",
        aliases: ["seoul", "south korea", "korea", "pangyo", "gangnam"],
        blurb:
            "Seoul and its nearby Pangyo Techno Valley form one of the world's most advanced technology metropolises. Leading in ultra-fast mobile infrastructure, semiconductors, AI, gaming, and web applications.",
        techParks: ["Pangyo Techno Valley", "Teheran Valley (Gangnam)", "Digital Media City (Sangam)", "Gasan Digital Complex"],
        salaryInsight: "Software Engineers earn an average of ₩55M to ₩120M+ per year, with leading tech platforms offering attractive stock bonuses.",
        topIndustries: ["Semiconductors & Mobile Tech", "Gaming & Entertainment (K-Tech)", "E-Commerce & Delivery Platforms", "AI & Robotics"],
        costOfLiving: "Moderate-High. Monthly rent for studios/officetels ranges from ₩700,000 to ₩1,600,000 with a standard deposit.",
        faqs: [
            {
                q: "What is Pangyo Techno Valley?",
                a: "Pangyo is South Korea's dedicated Silicon Valley located just south of Gangnam, hosting giants like Kakao, NCSoft, Naver, and hundreds of startups."
            }
        ],
    },
    {
        slug: "milan",
        name: "Milan",
        aliases: ["milan", "milano", "italy", "italia"],
        blurb:
            "Milan is Italy's economic engine and fastest-growing tech center. Home to Italy's main stock exchange, design powerhouses, and burgeoning fintech and e-commerce ecosystems.",
        techParks: ["Porta Nuova Innovation District", "MIND (Milano Innovation District)", "Bovisa Tech Park", "Tortona Creative & Tech Hub"],
        salaryInsight: "Software and IT professionals in Milan earn between €35,000 and €70,000 annually, with high demand for full-stack and cloud talent.",
        topIndustries: ["Fintech & Banking", "Fashion-Tech & E-Commerce", "Digital Marketing & Design", "Industry 4.0 & Automation"],
        costOfLiving: "Moderate-High. Monthly rent for 1-bedroom apartments ranges from €900 to €1,700.",
        faqs: [
            {
                q: "How is Milan's tech job market growing?",
                a: "Milan is attracting major international tech firms and investment funds, creating strong demand for cloud engineers, data scientists, and digital product specialists."
            }
        ],
    },
    {
        slug: "new-york",
        name: "New York",
        aliases: ["new york", "nyc", "manhattan", "brooklyn", "ny"],
        blurb:
            "New York City (Silicon Alley) is the world's second-largest tech ecosystem. Combining Wall Street capital with Madison Avenue media, NYC offers top-tier engineering and product roles.",
        techParks: ["Silicon Alley (Flatiron/Chelsea)", "DUMBO Tech Hub (Brooklyn)", "Cornell Tech Campus (Roosevelt Island)", "Hudson Yards"],
        salaryInsight: "Software Engineers in NYC earn $125,000 to $220,000+ base salary, with total compensation packages often exceeding $300,000+.",
        topIndustries: ["Fintech & Quantitative Trading", "Media & AdTech", "HealthTech & Enterprise SaaS", "AI & Machine Learning"],
        costOfLiving: "Very High. Monthly rent for 1-bedroom apartments ranges from $3,000 to $4,500.",
        faqs: [
            {
                q: "What makes NYC's tech ecosystem unique?",
                a: "NYC pairs high tech talent with the world's largest financial, media, healthcare, and retail corporations, creating massive B2B and consumer market opportunities."
            }
        ],
    },
    {
        slug: "san-francisco",
        name: "San Francisco",
        aliases: ["san francisco", "sf", "bay area", "silicon valley", "california"],
        blurb:
            "San Francisco and Silicon Valley remain the global epicenter of tech innovation, venture capital, and cutting-edge artificial intelligence research.",
        techParks: ["SoMa Tech Corridor", "Mission Bay Life Sciences & Tech", "Silicon Valley (Palo Alto, Mountain View, San Jose)", "South Park"],
        salaryInsight: "Software Engineers in the Bay Area command the highest salaries in the world, averaging $140,000 to $250,000+ base.",
        topIndustries: ["Generative AI & LLMs", "Cloud Computing & SaaS", "Autonomous Vehicles & Robotics", "Venture Capital & Seed Startups"],
        costOfLiving: "Very High. Monthly apartment rent averages $2,800 to $4,200.",
        faqs: [
            {
                q: "Why is San Francisco leading the AI revolution?",
                a: "OpenAI, Anthropic, Google, and dozens of top AI research labs and specialized venture firms are centered in San Francisco."
            }
        ],
    },
    {
        slug: "toronto",
        name: "Toronto",
        aliases: ["toronto", "canada", "gta", "ontario"],
        blurb:
            "Toronto is Canada's technology capital and the third-largest tech hub in North America. Renowned for AI pioneers at the Vector Institute and an welcoming tech immigration policy.",
        techParks: ["Downtown Toronto Tech Corridor", "MaRS Discovery District", "Liberty Village Tech Hub", "Waterloo-Toronto Tech Corridor"],
        salaryInsight: "Software Engineers in Toronto earn CAD $90,000 to $160,000+ per year.",
        topIndustries: ["AI & Machine Learning", "Fintech & Banking", "Enterprise SaaS", "HealthTech"],
        costOfLiving: "High. Monthly apartment rent ranges from CAD $2,000 to $2,800.",
        faqs: [
            {
                q: "Why is Toronto a top hub for AI talent?",
                a: "Toronto is home to the Vector Institute and University of Toronto, producing groundbreaking research in deep learning and neural networks."
            }
        ],
    },
    {
        slug: "singapore",
        name: "Singapore",
        aliases: ["singapore", "sg"],
        blurb:
            "Singapore is the technology and financial gateway to Southeast Asia. With government-backed innovation, progressive digital regulations, and regional headquarters for Fortune 500 tech firms.",
        techParks: ["One-North Innovation District", "Marina Bay Financial Centre", "Mapletree Business City", "Jurong Innovation District"],
        salaryInsight: "Software Engineers in Singapore earn SGD $75,000 to $160,000+ annually.",
        topIndustries: ["Fintech & Payments", "E-Commerce & SuperApps (Grab, Shopee)", "Cloud Infrastructure & Cybersecurity", "Regional Tech HQ"],
        costOfLiving: "High. Monthly rent for 1-bedroom apartments ranges from SGD $2,500 to $4,200.",
        faqs: [
            {
                q: "Why do multinational tech companies set up in Singapore?",
                a: "Singapore offers political stability, low corporate taxes, English proficiency, and immediate access to the 650M+ Southeast Asian consumer market."
            }
        ],
    },
];

export function getCityBySlug(slug: string): CityInfo | undefined {
    return CITIES.find((c) => c.slug === slug);
}

/* ────────────────────────────── Companies ──────────────────────────────── */

export interface CompanyInfo {
    slug: string;
    name: string;
    aliases: string[];
    logoEmoji: string;
    hq: string;
    industry: string;
    blurb: string;
    cultureHighlights: string[];
    salaryInsight: string;
    techStack: string[];
    faqs: { q: string; a: string }[];
}

export const COMPANIES: CompanyInfo[] = [
    {
        slug: "google",
        name: "Google",
        aliases: ["google", "alphabet", "google llc", "google cloud"],
        logoEmoji: "🌐",
        hq: "Mountain View, CA (Global Locations & Remote)",
        industry: "Search, Cloud Computing, AI & Consumer Technology",
        blurb:
            "Google (Alphabet) is a global technology leader organizing world information. Known for groundbreaking innovations in Search, Android, Google Cloud, and Gemini AI, Google offers industry-defining engineering culture, high autonomy, and world-class total compensation.",
        cultureHighlights: [
            "20% Innovation Time policy for experimental projects",
            "Comprehensive global health, wellness, and parental leave benefits",
            "Hybrid work flexibility with leading remote engineering teams",
            "Continuous education and conference sponsorships"
        ],
        salaryInsight: "Software engineers average $150K–$320K+ in North America / ₹28L–₹65L+ in India with competitive equity (GSUs).",
        techStack: ["Go", "C++", "Python", "Java", "Angular", "Kubernetes", "TensorFlow", "Spanner"],
        faqs: [
            {
                q: "What is Google's interview process like in 2026?",
                a: "The process typically includes an initial recruiter call, 1–2 technical phone/coding screenings (DSA), followed by an onsite/virtual round with coding, system design (for mid/senior), and Googleyness & Leadership behavioral interviews."
            },
            {
                q: "Does Google hire remote software engineers?",
                a: "Yes, Google offers approved remote roles across multiple teams including Google Cloud, Developer Relations, and platform infrastructure, alongside hybrid campus hubs worldwide."
            }
        ],
    },
    {
        slug: "amazon",
        name: "Amazon",
        aliases: ["amazon", "aws", "amazon web services", "amazon.com"],
        logoEmoji: "📦",
        hq: "Seattle, WA (Global Locations)",
        industry: "E-Commerce, Cloud Computing (AWS), Logistics & Digital Streaming",
        blurb:
            "Amazon and AWS power planetary-scale cloud infrastructure, retail logistics, and consumer devices. Guided by 16 Leadership Principles, Amazon provides fast career velocity and high-ownership problem solving across global distributed systems.",
        cultureHighlights: [
            "Customer Obsession and Ownership Leadership Principles",
            "Data-driven 2-pizza engineering teams",
            "Massive internal mobility across AWS, Retail, and Prime Video",
            "Day 1 startup mindset with global enterprise resources"
        ],
        salaryInsight: "SDE I to SDE III base packages range from $140K–$310K+ / ₹22L–₹55L+ with sign-on bonuses and vesting RSUs.",
        techStack: ["Java", "Python", "AWS Cloud Services", "Rust", "React", "DynamoDB", "ECS/EKS"],
        faqs: [
            {
                q: "How important are Amazon's 16 Leadership Principles?",
                a: "Vital. Every interview round at Amazon (including the Bar Raiser round) evaluates candidates on how their past experiences align with Customer Obsession, Ownership, Bias for Action, and Deliver Results using the STAR method."
            }
        ],
    },
    {
        slug: "microsoft",
        name: "Microsoft",
        aliases: ["microsoft", "azure", "microsoft corporation"],
        logoEmoji: "💻",
        hq: "Redmond, WA (Global Hubs & Remote)",
        industry: "Enterprise Cloud (Azure), Productivity (Office 365), OS & AI",
        blurb:
            "Microsoft empowers every person and organization on the planet to achieve more. Under Satya Nadella's leadership, Microsoft is pioneering generative AI with Copilot, Azure enterprise cloud, and gaming across Xbox.",
        cultureHighlights: [
            "Growth Mindset culture championed across all departments",
            "Exceptional work-life balance and family support policies",
            "Flexible hybrid and fully remote engineering arrangements",
            "Massive global learning budgets and internal hackathons"
        ],
        salaryInsight: "Software and cloud architects earn $145K–$290K+ in the US / ₹20L–₹50L+ in India.",
        techStack: ["C# / .NET", "TypeScript", "Python", "Azure", "React", "C++", "CosmosDB"],
        faqs: [
            {
                q: "What benefits does Microsoft offer remote engineers?",
                a: "Microsoft provides home office stipends, top-tier health insurance, 401(k)/PF matching, wellness reimbursements, and comprehensive paid time off."
            }
        ],
    },
    {
        slug: "meta",
        name: "Meta",
        aliases: ["meta", "facebook", "instagram", "whatsapp", "meta platforms"],
        logoEmoji: "♾️",
        hq: "Menlo Park, CA (Remote Friendly)",
        industry: "Social Technology, Open-Source AI, Virtual & Mixed Reality",
        blurb:
            "Meta connects over 3 billion people daily across Facebook, Instagram, WhatsApp, and Messenger, while spearheading open-source AI with the Llama foundational model family and PyTorch.",
        cultureHighlights: [
            "Move Fast and Focus on Long-Term Impact philosophy",
            "Top-of-market compensation and equity grants",
            "Bootcamp onboarding allowing engineers to choose their own squad",
            "Open-source first development ethos"
        ],
        salaryInsight: "Software engineers (E4–E6) command top compensation: $165K–$340K+ in North America / ₹30L–₹70L+ in India.",
        techStack: ["React", "Python", "PyTorch", "Rust", "Hack / PHP", "GraphQL", "RocksDB"],
        faqs: [
            {
                q: "What is Meta's Engineering Bootcamp?",
                a: "New engineering hires spend their first 4–6 weeks exploring different codebases, fixing real production bugs, and interviewing prospective teams before selecting their permanent squad."
            }
        ],
    },
    {
        slug: "apple",
        name: "Apple",
        aliases: ["apple", "apple inc", "apple computer"],
        logoEmoji: "🍎",
        hq: "Cupertino, CA",
        industry: "Consumer Hardware, Operating Systems & Digital Services",
        blurb:
            "Apple designs the world's most beloved consumer technology products, including the iPhone, Mac, iPad, and Apple Watch. Driven by meticulous design precision, privacy, and silicon innovation (M-series chips).",
        cultureHighlights: [
            "Uncompromising standard for craftsmanship and user experience",
            "Deep focus on user privacy and environmental sustainability",
            "Collaborative cross-functional teams between software and hardware",
            "Generous employee product discounts and stock purchase programs"
        ],
        salaryInsight: "ICT3 to ICT5 software engineers earn $150K–$310K+ / ₹25L–₹60L+ with RSUs.",
        techStack: ["Swift", "Objective-C", "C++", "Python", "Metal", "CoreML", "Go"],
        faqs: [
            {
                q: "What does Apple look for in software engineers?",
                a: "Apple values deep systems understanding, pixel-perfect attention to detail, strong CS fundamentals, and passion for delighting millions of everyday users."
            }
        ],
    },
    {
        slug: "netflix",
        name: "Netflix",
        aliases: ["netflix"],
        logoEmoji: "🍿",
        hq: "Los Gatos, CA (Remote Friendly)",
        industry: "Streaming Entertainment & Media Production",
        blurb:
            "Netflix delivers award-winning streaming entertainment to 260M+ paid memberships worldwide. Renowned for its 'Freedom and Responsibility' culture and top-of-market all-cash compensation.",
        cultureHighlights: [
            "Freedom and Responsibility culture with no bureaucratic guardrails",
            "Top-of-market compensation with flexible cash vs stock allocation",
            "Stunning colleagues philosophy — hiring only high-performing senior talent",
            "Context, not control management approach"
        ],
        salaryInsight: "Known for industry-leading all-cash compensation: $250K–$500K+ for senior software engineers.",
        techStack: ["Java", "Node.js", "React", "Python", "AWS", "Spinnaker", "GraphQL"],
        faqs: [
            {
                q: "Does Netflix hire junior engineers?",
                a: "Historically Netflix hired almost exclusively senior talent. Recently, they expanded early-career programs and internships in engineering and data science."
            }
        ],
    },
    {
        slug: "stripe",
        name: "Stripe",
        aliases: ["stripe", "stripe payments"],
        logoEmoji: "💳",
        hq: "San Francisco, CA & Dublin (Remote First)",
        industry: "Financial Infrastructure & Internet Payments",
        blurb:
            "Stripe builds financial infrastructure for the internet, processing hundreds of billions of dollars annually for startups to Fortune 500 enterprises with world-class developer experience.",
        cultureHighlights: [
            "Written culture emphasizing deep memos and analytical rigor",
            "Remote-first engineering hubs across North America, Europe, and Asia",
            "Obsession with developer API ergonomics and uptime reliability",
            "High trust and transparent company-wide communications"
        ],
        salaryInsight: "Engineers earn $160K–$330K+ / ₹30L–₹65L+ with strong remote benefits.",
        techStack: ["Ruby / Sorbet", "Go", "TypeScript", "React", "AWS", "Kafka", "PostgreSQL"],
        faqs: [
            {
                q: "How does Stripe support remote workers?",
                a: "Stripe was an early pioneer of remote-first engineering, offering ergonomic home office stipends, local co-working allowances, and bi-annual team offsites."
            }
        ],
    },
    {
        slug: "uber",
        name: "Uber",
        aliases: ["uber", "uber technologies"],
        logoEmoji: "🚗",
        hq: "San Francisco, CA",
        industry: "Mobility, Logistics & On-Demand Delivery",
        blurb:
            "Uber moves millions of people and goods every day across 70+ countries. Engineers build hyper-scalable distributed dispatch algorithms, real-time routing engines, and fintech billing systems.",
        cultureHighlights: [
            "High scale challenges processing petabytes of real-time geospatial data",
            "Global tech campuses in the US, Amsterdam, Bangalore, and Hyderabad",
            "Comprehensive commuter benefits and Uber ride credits",
            "Open source contributions in distributed tracing (Jaeger) and data lakes"
        ],
        salaryInsight: "Software engineers earn $150K–$310K+ in the US / ₹26L–₹58L+ in India.",
        techStack: ["Go", "Java", "Python", "Kafka", "React Native", "MySQL", "Cassandra"],
        faqs: [
            {
                q: "What types of problems do Uber engineers solve?",
                a: "Geospatial routing algorithms, dynamic marketplace pricing, fraud prevention, distributed database scaling, and autonomous vehicle simulation."
            }
        ],
    },
    {
        slug: "spotify",
        name: "Spotify",
        aliases: ["spotify", "spotify ab"],
        logoEmoji: "🎧",
        hq: "Stockholm, Sweden (Work From Anywhere)",
        industry: "Audio Streaming, Music Technology & Podcasting",
        blurb:
            "Spotify is the world's most popular audio streaming subscription service with 600M+ users. Guided by its pioneering 'Work From Anywhere' policy, engineers build recommendation algorithms and audio players worldwide.",
        cultureHighlights: [
            "Official 'Work From Anywhere' flexible location program",
            "Agile squad and chapter engineering model",
            "Passionate, music-infused creative work environment",
            "Swedish work-life balance and family wellness principles"
        ],
        salaryInsight: "Software engineers earn €75K–€140K in Europe / $150K–$280K in North America.",
        techStack: ["Java", "Python", "GCP", "C++", "React", "BigQuery", "Docker"],
        faqs: [
            {
                q: "How does Spotify's 'Work From Anywhere' policy work?",
                a: "Spotify employees can choose whether to work from home, from a Spotify office, or from a co-working space in an approved country or timezone."
            }
        ],
    },
    {
        slug: "shopify",
        name: "Shopify",
        aliases: ["shopify"],
        logoEmoji: "🛍️",
        hq: "Ottawa, Canada (Digital by Default / Remote)",
        industry: "E-Commerce Software & Merchant Solutions",
        blurb:
            "Shopify powers over millions of businesses in more than 175 countries with an entirely remote, 'Digital by Default' culture. Famous for building on Ruby on Rails at monumental global scale.",
        cultureHighlights: [
            "Digital by Default — 100% remote company by design",
            "High autonomy and craft-focused engineering tracks",
            "World-leading contributions to open-source Ruby on Rails",
            "Flexible total rewards compensation model"
        ],
        salaryInsight: "CAD $130K–$240K in Canada / USD $140K–$260K for software developers.",
        techStack: ["Ruby on Rails", "TypeScript", "React", "GraphQL", "MySQL", "Google Cloud"],
        faqs: [
            {
                q: "Is Shopify fully remote?",
                a: "Yes. Shopify operates under a permanent 'Digital by Default' model where employees work remotely from across North America and select global hubs."
            }
        ],
    },
    {
        slug: "zoho",
        name: "Zoho",
        aliases: ["zoho", "zoho corporation", "zoho corp"],
        logoEmoji: "💼",
        hq: "Chennai, India (Global Offices)",
        industry: "Enterprise Cloud Software, CRM & B2B SaaS",
        blurb:
            "Zoho is a bootstrapped Indian technology giant providing 55+ cloud applications to over 100 million users. Known for building its own data centers, rural tech offices, and deep engineering self-reliance.",
        cultureHighlights: [
            "Bootstrapped, zero-debt company with unmatched job security",
            "R&D focused: all software and hardware infrastructure built in-house",
            "Pioneering rural tech campuses in Tenkasi and beyond",
            "No credentialism: skills prioritized over university pedigree"
        ],
        salaryInsight: "Entry-level to senior product engineers earn ₹6L to ₹25L+ with extensive campus amenities.",
        techStack: ["Java", "JavaScript", "C++", "PostgreSQL", "Linux", "Proprietary Cloud"],
        faqs: [
            {
                q: "What makes Zoho's company culture unique?",
                a: "Zoho is 100% privately owned and profitable, shielding employees from short-term investor pressures and tech layoffs while investing deeply in local community development."
            }
        ],
    },
    {
        slug: "tcs",
        name: "Tata Consultancy Services (TCS)",
        aliases: ["tcs", "tata consultancy", "tata consultancy services"],
        logoEmoji: "🏢",
        hq: "Mumbai, India (Global Delivery Centers)",
        industry: "IT Services, Enterprise Consulting & Digital Solutions",
        blurb:
            "TCS is a global leader in IT services, consulting, and business solutions. As the flagship technology arm of the Tata Group, TCS employs over 600,000 consultants across 55 countries.",
        cultureHighlights: [
            "Part of the revered, values-driven Tata Group",
            "Unrivaled scale and training programs (TCS Elevate & Digital)",
            "Global client exposure across banking, healthcare, and retail",
            "Comprehensive health, retirement, and job stability"
        ],
        salaryInsight: "Freshers (Ninja/Digital/Prime) start from ₹3.6L to ₹9L, while architects earn ₹18L to ₹40L+.",
        techStack: ["Java", "Python", "Cloud (AWS/Azure/GCP)", "SAP", "React", "Angular", "Spring Boot"],
        faqs: [
            {
                q: "What are the TCS Fresher hiring tracks?",
                a: "TCS hires freshers via the National Qualifier Test (NQT) into three distinct tiers: Ninja (~₹3.6 LPA), Digital (~₹7 LPA), and Prime (~₹9 LPA) based on coding performance."
            }
        ],
    },
];

export function getCompanyBySlug(slug: string): CompanyInfo | undefined {
    return COMPANIES.find((c) => c.slug === slug);
}

export function jobMatchesCompany(job: ExternalJob, company: CompanyInfo): boolean {
    const comp = job.company.toLowerCase().trim();
    if (comp === company.slug || comp.includes(company.slug)) return true;
    return company.aliases.some((alias) => comp.includes(alias));
}

/* ─────────────────────────── Slug generation ───────────────────────────── */

/** Create a stable, URL-safe slug from a job title + company. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

/** Stable public slug for a job. */
export function jobSlug(job: Pick<ExternalJob, "id" | "title">): string {
    return `${slugify(job.title)}-${slugify(job.id).slice(-12)}`;
}

export function findJobBySlug(slug: string, jobs: ExternalJob[]): ExternalJob | undefined {
    return jobs.find((job) => jobSlug(job) === slug);
}

/* ───────────────────────────── Fetch helpers ───────────────────────────── */

/** Remove HTML tags and collapse whitespace from a job description. */
export function cleanDescription(html: string): string {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/"/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}

/** Format an ISO date into a friendly "Aug 2, 2026" string. */
export function formatPostedDate(iso: string | undefined): string {
    if (!iso) return "Recently";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Days since a job was posted (for badges). */
export function daysSincePosted(iso: string | undefined): number | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Shorten a job description for card previews. */
export function truncate(text: string, maxLength = 160): string {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trimEnd()}…`;
}

/* ───────────────────────────── Matching logic ──────────────────────────── */

/** Score a job against a set of keywords (0-100). */
export function keywordScore(text: string, keywords: string[]): number {
    if (keywords.length === 0) return 0;
    const lower = text.toLowerCase();
    let hits = 0;
    for (const kw of keywords) {
        if (lower.includes(kw.toLowerCase())) hits += 1;
    }
    return Math.round((hits / keywords.length) * 100);
}

/** Normalize a job title for matching. */
function normalizeTitle(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Check if a job matches a category based on title + company + description. */
export function jobMatchesCategory(job: ExternalJob, category: JobCategory): boolean {
    const haystack = `${job.title} ${job.company} ${job.description}`.toLowerCase();
    return category.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

/** Normalize a location string for matching. */
export function normalizeLocation(location: string): string {
    return location.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Check if a job is located in (or near) a city. */
export function jobMatchesCity(job: ExternalJob, city: CityInfo): boolean {
    const loc = normalizeLocation(job.location);
    if (loc === "remote" || loc.includes("remote")) return true;
    return city.aliases.some((alias) => loc.includes(alias));
}

/** Check if a job is remote. */
export function isRemoteJob(job: ExternalJob): boolean {
    return normalizeLocation(job.location).includes("remote");
}

/* ──────────────────────── Anti-Scam & Quality Filter ───────────────────── */

const SCAM_PATTERNS = [
    /\bt\.me\/[a-z0-9_]+/i,
    /\bwa\.me\/[0-9]+/i,
    /\bchat\.whatsapp\.com/i,
    /contact (me |us )?(on |via )?(telegram|whatsapp)/i,
    /send (cv|resume) to whatsapp/i,
    /registration fee/i,
    /security deposit/i,
    /pay (a |an )?(initial |small |refundable )?fee/i,
    /investment required/i,
    /processing fee/i,
    /no interview direct joining/i,
    /earn \$\d{4,}\+? (per|a) day/i,
    /earn ₹\d{5,}\+? (per|a) day/i,
    /data entry operator (home based|offline)/i,
    /form filling (work|job)/i,
    /captcha typing/i,
];

/**
 * Validates if a job is genuine and free from common scam patterns.
 */
export function isGenuineJob(job: Partial<ExternalJob>): boolean {
    if (!job.title || job.title.trim().length < 3) return false;
    if (!job.company || job.company.trim().length < 2) return false;
    if (!job.description || job.description.trim().length < 40) return false;

    // Check application link
    if (!job.applicationLink || !/^https?:\/\//i.test(job.applicationLink.trim())) {
        return false;
    }

    const textToScan = `${job.title} ${job.company} ${job.description}`.toLowerCase();

    for (const pattern of SCAM_PATTERNS) {
        if (pattern.test(textToScan)) {
            return false;
        }
    }

    return true;
}

/**
 * Check if a job is fresh (posted within maxDays, default 30 days).
 */
export function isJobFresh(job: Pick<ExternalJob, "postedAt">, maxDays = 30): boolean {
    const days = daysSincePosted(job.postedAt);
    if (days === null) return true; // If no date, treat as fresh if recent
    return days <= maxDays;
}

/* ────────────────────────── Skills Extraction ─────────────────────────── */

const COMMON_SKILLS = [
    "TypeScript", "JavaScript", "Python", "React", "Next.js", "Node.js", "Go", "Golang",
    "Rust", "Java", "C++", "C#", ".NET", "PHP", "Ruby", "Rails", "Swift", "Kotlin",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "REST API",
    "AWS", "GCP", "Azure", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux",
    "Figma", "UI/UX", "Tailwind CSS", "HTML5", "CSS3", "Git", "GitHub",
    "Machine Learning", "AI", "LLM", "Prompt Engineering", "PyTorch", "TensorFlow",
    "Power BI", "Tableau", "Pandas", "Scikit-Learn", "ETL", "Data Warehousing",
    "Agile", "Scrum", "Product Management", "Jira", "SEO", "Growth Marketing"
];

/**
 * Extract matched skills from a job title and description.
 */
export function extractSkillsFromJob(text: string, limit = 6): string[] {
    const lower = text.toLowerCase();
    const matched: string[] = [];

    for (const skill of COMMON_SKILLS) {
        const skillLower = skill.toLowerCase();
        // Regex word boundary matching
        const escaped = skillLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
        if (regex.test(lower)) {
            matched.push(skill);
            if (matched.length >= limit) break;
        }
    }

    return matched;
}

/* ─────────────────────── Curated Top 10 Job Engine ─────────────────────── */

/**
 * Ranks and extracts the Top 10 Curated, verified, genuine, and fresh jobs.
 */
export function getCuratedTop10Jobs(jobs: ExternalJob[]): ExternalJob[] {
    // Filter to genuine & fresh jobs (< 21 days old)
    const valid = jobs.filter((j) => isGenuineJob(j) && isJobFresh(j, 21));

    // Calculate quality score for ranking
    const scored = valid.map((job) => {
        let score = 50;
        const days = daysSincePosted(job.postedAt) ?? 10;
        
        // Recency bonus: max 30 pts for 0 days, decay down
        score += Math.max(0, 30 - days * 2);

        // Content depth bonus
        if (job.description.length > 300) score += 10;
        if (job.description.length > 800) score += 10;

        // Skills clarity bonus
        const skills = extractSkillsFromJob(`${job.title} ${job.description}`);
        score += Math.min(skills.length * 2, 10);

        // Remote bonus
        if (isRemoteJob(job)) score += 5;

        return { job, score };
    });

    // Sort by highest score first
    scored.sort((a, b) => b.score - a.score);

    // Ensure diversity across roles in top 10
    const top10: ExternalJob[] = [];
    const seenTitles = new Set<string>();

    for (const { job } of scored) {
        const simplifiedTitle = normalizeTitle(job.title).slice(0, 15);
        if (!seenTitles.has(simplifiedTitle)) {
            seenTitles.add(simplifiedTitle);
            top10.push(job);
        }
        if (top10.length === 10) break;
    }

    // If fewer than 10 unique, fill with remaining scored
    if (top10.length < 10) {
        for (const { job } of scored) {
            if (!top10.some((t) => t.id === job.id)) {
                top10.push(job);
            }
            if (top10.length === 10) break;
        }
    }

    return top10.slice(0, 10);
}

/* ─────────────────────────────── Data fetch ────────────────────────────── */

const SEED_QUERIES = ["developer", "designer", "product manager", "data analyst", "marketing"];

let cachedPublicJobs: ExternalJob[] | null = null;
let lastPublicJobsFetchTime = 0;
const PUBLIC_JOBS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes in-memory cache for builds & server revalidation

/**
 * Fetch public jobs from all free sources, deduplicated and sorted by recency.
 * Cached at the module level for 10 minutes to limit external API calls.
 */
export async function fetchPublicJobs(): Promise<ExternalJob[]> {
    const now = Date.now();
    if (cachedPublicJobs && now - lastPublicJobsFetchTime < PUBLIC_JOBS_CACHE_TTL) {
        return cachedPublicJobs;
    }

    try {
        // Try a few seed queries so we get broad coverage, then dedupe.
        const [remotiveA, remotiveB, remoteok, arbeitnowA, arbeitnowB] = await Promise.all([
            fetchRemotiveJobs("developer"),
            fetchRemotiveJobs("product"),
            fetchRemoteOKJobs(["developer", "design", "marketing", "data"]),
            fetchArbeitnowJobs("software"),
            fetchArbeitnowJobs("design"),
        ]);

        const all = [...remotiveA, ...remotiveB, ...remoteok, ...arbeitnowA, ...arbeitnowB];

        // Deduplicate by normalized title + company & filter genuine / non-expired jobs.
        const seen = new Set<string>();
        const unique: ExternalJob[] = [];
        for (const job of all) {
            if (!isGenuineJob(job) || !isJobFresh(job, 30)) {
                continue;
            }
            const key = `${normalizeTitle(job.title)}|${job.company.toLowerCase().trim()}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push({ ...job, description: cleanDescription(job.description) });
            }
        }

        // Sort by postedAt desc, most recent first.
        unique.sort((a, b) => {
            const ta = new Date(a.postedAt).getTime();
            const tb = new Date(b.postedAt).getTime();
            if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
            if (Number.isNaN(ta)) return 1;
            if (Number.isNaN(tb)) return -1;
            return tb - ta;
        });

        cachedPublicJobs = unique.slice(0, MAX_JOBS_PER_PAGE * 3);
        lastPublicJobsFetchTime = now;
        return cachedPublicJobs;
    } catch (error) {
        console.error("[PublicJobs] Failed to fetch public jobs:", error);
        return cachedPublicJobs || [];
    }
}

export async function fetchPublicJobsFiltered(opts?: {
    category?: JobCategory;
    city?: CityInfo;
    company?: CompanyInfo;
    remoteOnly?: boolean;
}): Promise<ExternalJob[]> {
    const all = await fetchPublicJobs();
    return all.filter((job) => {
        if (!isJobFresh(job, 30)) return false;
        if (opts?.remoteOnly && !isRemoteJob(job)) return false;
        if (opts?.category && !jobMatchesCategory(job, opts.category)) return false;
        if (opts?.city && !jobMatchesCity(job, opts.city)) return false;
        if (opts?.company && !jobMatchesCompany(job, opts.company)) return false;
        return true;
    });
}

/* ─────────────────────── Build-time sample data ────────────────────────── */

/**
 * Sample jobs used for static generation / graceful fallback when external
 * APIs are unavailable (e.g., during `next build` with no network). These are
 * realistic example listings that never link to live applications; they keep
 * pages meaningful and renderable in any environment.
 */
export const SAMPLE_JOBS: ExternalJob[] = [
    {
        id: "sample-frontend-react",
        title: "Frontend Developer (React)",
        company: "TechNova",
        description:
            "We're looking for a Frontend Developer with 2+ years of React experience to build fast, accessible interfaces. You'll work with designers and backend engineers to ship features end-to-end. Strong JavaScript, TypeScript, and CSS skills required. Experience with Next.js and Tailwind CSS is a plus.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-data-analyst",
        title: "Data Analyst",
        company: "DataWorks",
        description:
            "Join our analytics team to build dashboards and insights that drive decisions. You should be strong in SQL, Excel, and a visualization tool (Power BI or Tableau). Python is a bonus. This role suits candidates who love turning messy data into clear stories for stakeholders.",
        location: "Bangalore",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-product-manager",
        title: "Product Manager",
        company: "GrowthLab",
        description:
            "We are hiring a Product Manager to own our SaaS roadmap. You will talk to customers, prioritize features, write PRDs, and work with engineering and design to ship. 3+ years of product experience preferred. Strong analytical and communication skills are essential.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-devops",
        title: "DevOps Engineer",
        company: "CloudScale",
        description:
            "We're looking for a DevOps Engineer to manage our AWS infrastructure and CI/CD pipelines. Experience with Docker, Kubernetes, Terraform, and Linux is required. You will improve deployment speed and system reliability across our microservices.",
        location: "Hyderabad",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-ml-engineer",
        title: "Machine Learning Engineer",
        company: "Neuralytics",
        description:
            "Build and deploy machine learning models at scale. You should be comfortable with Python, PyTorch or TensorFlow, and cloud ML services. Experience with MLOps practices and model monitoring is a strong plus. Remote-friendly team.",
        location: "Remote",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        source: "sample",
    },
    {
        id: "sample-ux-designer",
        title: "UX/UI Designer",
        company: "PixelCraft",
        description:
            "We are looking for a UX/UI Designer to design intuitive web and mobile experiences. You should have a strong portfolio, proficiency in Figma, and experience running user research and usability tests. Motion design is a bonus.",
        location: "Mumbai",
        applicationLink: "https://decajob.com/login",
        postedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
        source: "sample",
    },
];

/**
 * Get public jobs for rendering. Uses cached API data when available, falling
 * back to sample jobs so pages always have content.
 */
export async function getPublicJobs(): Promise<ExternalJob[]> {
    const live = await fetchPublicJobs();
    return live.length > 0 ? live : SAMPLE_JOBS;
}

/**
 * Get filtered public jobs with graceful fallback to sample data.
 */
export async function getPublicJobsFiltered(opts?: {
    category?: JobCategory;
    city?: CityInfo;
    company?: CompanyInfo;
    remoteOnly?: boolean;
}): Promise<ExternalJob[]> {
    const live = await fetchPublicJobsFiltered(opts);
    if (live.length > 0) return live;

    // Fallback: filter sample data by the same rules.
    const filtered = SAMPLE_JOBS.filter((job) => {
        if (opts?.remoteOnly && !isRemoteJob(job)) return false;
        if (opts?.category && !jobMatchesCategory(job, opts.category)) return false;
        if (opts?.city && !jobMatchesCity(job, opts.city)) return false;
        if (opts?.company && !jobMatchesCompany(job, opts.company)) return false;
        return true;
    });
    return filtered;
}

