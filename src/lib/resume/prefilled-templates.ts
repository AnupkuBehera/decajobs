import type { ResumeContent } from "@/lib/gemini/client";

export interface PrefilledTemplateMeta {
  slug: string;
  title: string;
  category: string;
  icon: string;
  atsScoreEstimate: number;
  description: string;
  data: ResumeContent;
}

export const PREFILLED_TEMPLATES: PrefilledTemplateMeta[] = [
  {
    slug: "software-engineer",
    title: "Full-Stack Software Engineer",
    category: "Engineering",
    icon: "💻",
    atsScoreEstimate: 98,
    description: "Modern full-stack and backend engineer resume emphasizing microservices, low-latency APIs, and cloud infrastructure.",
    data: {
      personalInfo: {
        fullName: "Alex Chen",
        headline: "Senior Full-Stack Software Engineer | TypeScript · Next.js · Go · Distributed Systems",
        email: "alex.chen.dev@email.com",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA (Open to Remote)",
        linkedinUrl: "https://linkedin.com/in/alexchen-engineer",
        portfolioUrl: "https://github.com/alexchen-dev",
      },
      professionalSummary:
        "High-impact Full-Stack Software Engineer with 5+ years of experience architecting resilient distributed systems and responsive web applications. Proven track record reducing API latencies by 42% and scaling SaaS platforms to 2.5M+ active users using TypeScript, Next.js, Node.js, and AWS. Passionate about automated CI/CD pipelines, clean architecture, and developer velocity.",
      workExperience: [
        {
          company: "Veloce Cloud Technologies",
          jobTitle: "Senior Software Engineer",
          location: "San Francisco, CA (Hybrid)",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Architected and deployed event-driven microservices using Node.js, Go, and Kafka, handling 15M+ daily webhook events with 99.99% uptime.",
            "Spearheaded database query optimization across PostgreSQL and Redis clusters, driving a 42% decrease in p99 query latency.",
            "Engineered reusable Next.js React component library adopted by 8 engineering teams, accelerating front-end sprint delivery by 30%.",
            "Championed automated end-to-end testing with Playwright and GitHub Actions, boosting test coverage from 68% to 94%.",
          ],
        },
        {
          company: "Nexus Digital Systems",
          jobTitle: "Full-Stack Developer",
          location: "Austin, TX",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Built customer-facing billing and checkout portal integrating Stripe Elements, generating $4.8M in processed ARR with zero security incidents.",
            "Migrated legacy monolithic Rails application to containerized Docker services orchestrated via AWS ECS and Terraform.",
            "Partnered with UX researchers and product managers to redesign core analytics dashboard, lifting user weekly retention by 18%.",
            "Mentored 4 junior software engineers and led bi-weekly technical design reviews.",
          ],
        },
      ],
      education: [
        {
          degree: "B.S. in Computer Science (Summa Cum Laude)",
          institution: "University of California, Berkeley",
          completionDate: "2021",
        },
      ],
      skillCategories: [
        {
          categoryName: "Languages & Frameworks",
          skills: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "React", "Next.js", "Node.js", "GraphQL"],
        },
        {
          categoryName: "Databases & Cloud",
          skills: ["PostgreSQL", "Redis", "MongoDB", "AWS (ECS, S3, Lambda)", "Docker", "Kubernetes", "Terraform"],
        },
        {
          categoryName: "Testing & DevOps",
          skills: ["Jest", "Playwright", "GitHub Actions", "CI/CD", "Datadog", "Microservices Architecture"],
        },
      ],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          year: "2024",
        },
      ],
    },
  },
  {
    slug: "data-analyst",
    title: "Data Analyst & Analytics Engineer",
    category: "Data & AI",
    icon: "📊",
    atsScoreEstimate: 96,
    description: "Data analytics resume focused on SQL data modeling, dbt pipelines, revenue cohort analysis, and executive dashboards.",
    data: {
      personalInfo: {
        fullName: "Sarah Jenkins",
        headline: "Lead Data Analyst | SQL · dbt · Python · Tableau · Revenue Analytics",
        email: "sarah.jenkins.data@email.com",
        phone: "+1 (555) 876-5432",
        location: "New York, NY (Open to Remote)",
        linkedinUrl: "https://linkedin.com/in/sarahjenkins-analytics",
        portfolioUrl: "https://github.com/sarahjenkins-data",
      },
      professionalSummary:
        "Results-driven Data Analyst with 4+ years translating raw multi-source data into actionable business strategy and revenue growth. Specialized in modern data stacks (Snowflake, dbt, SQL, Python, Tableau), building automated ETL pipelines and self-service BI dashboards that unlocked $1.4M in operational cost savings. Expert in cohort retention modeling, attribution, and executive storytelling.",
      workExperience: [
        {
          company: "ScaleMetric Software",
          jobTitle: "Senior Data & Business Analyst",
          location: "New York, NY",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Constructed centralized enterprise dbt models and Snowflake data marts, cutting daily reporting refresh times from 4 hours to 18 minutes.",
            "Designed executive retention and ARR cohort Tableau dashboards referenced weekly by C-suite leaders to steer $45M in strategic capital allocation.",
            "Identified checkout funnel friction points through granular SQL funnel analysis, driving an 11.4% lift in e-commerce conversion rates.",
            "Automated anomalous revenue detection pipelines using Python and Great Expectations, catching data discrepancies with 99.8% precision.",
          ],
        },
        {
          company: "Horizon Financial Group",
          jobTitle: "Business Intelligence Analyst",
          location: "Boston, MA",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Standardized KPI reporting across 6 cross-functional departments, decommissioning 45 redundant legacy Excel spreadsheets.",
            "Modeled customer lifetime value (LTV) and CAC attribution algorithms, improving paid ad marketing budget efficiency by 22%.",
            "Conducted quarterly A/B test statistical significance reviews across 20+ feature rollouts using Python (scipy, pandas, statsmodels).",
          ],
        },
      ],
      education: [
        {
          degree: "B.S. in Applied Statistics & Information Systems",
          institution: "New York University (NYU)",
          completionDate: "2021",
        },
      ],
      skillCategories: [
        {
          categoryName: "Analytics & Querying",
          skills: ["Advanced SQL (Window Functions, CTEs)", "Python (Pandas, NumPy)", "dbt", "Snowflake", "BigQuery"],
        },
        {
          categoryName: "Visualization & BI",
          skills: ["Tableau", "Power BI", "Looker", "Metabase", "Executive Storytelling", "Statistical Modeling"],
        },
        {
          categoryName: "Tools & Methodologies",
          skills: ["Git", "Airflow", "A/B Testing", "Cohort Analysis", "Funnel Optimization", "Data Warehousing"],
        },
      ],
      certifications: [
        {
          name: "dbt Certified Developer",
          issuer: "dbt Labs",
          year: "2024",
        },
        {
          name: "Tableau Certified Data Analyst",
          issuer: "Tableau",
          year: "2023",
        },
      ],
    },
  },
  {
    slug: "product-manager",
    title: "Product Manager (Technical & Growth)",
    category: "Product",
    icon: "🚀",
    atsScoreEstimate: 97,
    description: "High-impact product resume highlighting 0-to-1 feature launches, customer discovery, experimentation, and cross-functional leadership.",
    data: {
      personalInfo: {
        fullName: "Marcus Vance",
        headline: "Product Manager | SaaS Growth · 0-to-1 Products · Agile · User Retention",
        email: "marcus.vance.pm@email.com",
        phone: "+1 (555) 345-6789",
        location: "Seattle, WA (Remote friendly)",
        linkedinUrl: "https://linkedin.com/in/marcusvance-pm",
        portfolioUrl: "https://marcusvance.me",
      },
      professionalSummary:
        "Data-driven Product Manager with 5 years leading cross-functional engineering, design, and marketing teams to build market-defining B2B and consumer products. Successfully orchestrated the 0-to-1 launch of an enterprise collaboration tool that grew to $3.2M ARR in 14 months. Adept at rapid prototyping, quantitative user research, OKR alignment, and agile execution.",
      workExperience: [
        {
          company: "Aura Workspace",
          jobTitle: "Senior Product Manager – Core Experience",
          location: "Seattle, WA",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Led product vision, roadmap, and execution for AI-assisted workflow suite, increasing user daily active engagement (DAU/MAU) by 24%.",
            "Structured continuous discovery program conducting 60+ customer interviews, prioritizing key backlog items that reduced onboarding churn by 19%.",
            "Managed 12-person squad (6 engineers, 2 designers, 2 data analysts, 2 QAs) delivering weekly sprint releases with a 95% on-time velocity.",
            "Designed and executed 35+ multivariate onboarding experiments, driving an aggregate 28% increase in trial-to-paid conversion.",
          ],
        },
        {
          company: "Stride Media",
          jobTitle: "Product Manager",
          location: "Chicago, IL",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Defined PRD specifications and go-to-market plan for creator monetisation tools, onboarding 14,000 creators and generating $850K GMV in Q1.",
            "Championed product analytics overhaul via Mixpanel and Amplitude, establishing core company-wide north star metrics.",
            "Negotiated API integrations with 3 third-party identity verification partners, cutting candidate sign-up drop-off by 14%.",
          ],
        },
      ],
      education: [
        {
          degree: "B.A. in Economics & Business Administration",
          institution: "University of Washington",
          completionDate: "2020",
        },
      ],
      skillCategories: [
        {
          categoryName: "Product Management",
          skills: ["Product Strategy", "Roadmapping", "PRD Writing", "Customer Discovery", "Go-To-Market (GTM)", "A/B Testing"],
        },
        {
          categoryName: "Analytics & Technical",
          skills: ["Mixpanel", "Amplitude", "SQL (Intermediate)", "Figma", "Jira", "Linear", "REST APIs"],
        },
        {
          categoryName: "Leadership & Frameworks",
          skills: ["Scrum / Agile", "Design Thinking", "OKRs", "Stakeholder Management", "Executive Presentations"],
        },
      ],
      certifications: [
        {
          name: "Certified Scrum Product Owner (CSPO)",
          issuer: "Scrum Alliance",
          year: "2023",
        },
      ],
    },
  },
  {
    slug: "devops-cloud-engineer",
    title: "DevOps & Cloud Platform Engineer",
    category: "Infrastructure",
    icon: "☁️",
    atsScoreEstimate: 99,
    description: "Cloud engineer resume with proven metrics in Kubernetes, Terraform IaC, AWS/GCP architecture, and 99.99% system availability.",
    data: {
      personalInfo: {
        fullName: "Vikram Malhotra",
        headline: "DevOps & Cloud Engineer | Kubernetes · Terraform · AWS · CI/CD · Site Reliability",
        email: "vikram.malhotra.ops@email.com",
        phone: "+1 (555) 456-7890",
        location: "Toronto, ON (Open to Remote)",
        linkedinUrl: "https://linkedin.com/in/vikram-devops",
        portfolioUrl: "https://github.com/vikram-infra",
      },
      professionalSummary:
        "Cloud Infrastructure and DevOps Specialist with 6+ years designing, automating, and maintaining high-availability cloud platforms. Demonstrated expertise implementing zero-trust Kubernetes clusters and Terraform infrastructure-as-code, cutting monthly cloud expenditure by 34% ($280K/year) while maintaining 99.99% SLA across multi-region deployments. Passionate about GitOps and DevSecOps.",
      workExperience: [
        {
          company: "CloudScale Networks",
          jobTitle: "Lead Site Reliability & DevOps Engineer",
          location: "Toronto, ON",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Architected multi-tenant Kubernetes (EKS) infrastructure running 200+ containerized microservices across AWS us-east and eu-central regions.",
            "Engineered automated GitOps deployment pipelines with ArgoCD and GitHub Actions, shrinking code deployment lead times from 3 days to 12 minutes.",
            "Conducted enterprise AWS cost optimization audit (Rightsizing, Spot instances, Graviton migration), yielding 34% annual cost reductions ($280K saved).",
            "Implemented unified observability stack with Prometheus, Grafana, and OpenTelemetry, reducing MTTR (Mean Time to Resolution) from 45 mins to 8 mins.",
          ],
        },
        {
          company: "OmniTech Solutions",
          jobTitle: "Cloud DevOps Engineer",
          location: "Vancouver, BC",
          startDate: "2020",
          endDate: "2023",
          highlights: [
            "Authored 100% of cloud infrastructure as code (IaC) utilizing modular Terraform and Terragrunt, achieving SOC2 Type II compliance.",
            "Built automated vulnerability scanning in container build pipelines with Trivy and Snyk, remediating 180+ critical CVEs before production releases.",
            "Managed PostgreSQL database read replica scaling, auto-failover, and point-in-time recovery configurations.",
          ],
        },
      ],
      education: [
        {
          degree: "B.Tech in Computer Engineering",
          institution: "University of Waterloo",
          completionDate: "2020",
        },
      ],
      skillCategories: [
        {
          categoryName: "Cloud & Orchestration",
          skills: ["AWS (EKS, IAM, VPC, RDS, S3)", "Google Cloud (GCP)", "Kubernetes (K8s)", "Docker", "Helm", "ArgoCD"],
        },
        {
          categoryName: "Infrastructure as Code",
          skills: ["Terraform", "Terragrunt", "Ansible", "Linux / Bash Scripting", "Python", "CloudFormation"],
        },
        {
          categoryName: "CI/CD & Observability",
          skills: ["GitHub Actions", "GitLab CI", "Prometheus", "Grafana", "Datadog", "OpenTelemetry", "DevSecOps"],
        },
      ],
      certifications: [
        {
          name: "Certified Kubernetes Administrator (CKA)",
          issuer: "Cloud Native Computing Foundation (CNCF)",
          year: "2024",
        },
        {
          name: "AWS Certified DevOps Engineer – Professional",
          issuer: "Amazon Web Services",
          year: "2023",
        },
      ],
    },
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX & Product Designer",
    category: "Design",
    icon: "🎨",
    atsScoreEstimate: 95,
    description: "Product designer resume focused on design systems, user journey optimization, accessible design (WCAG), and high-converting interfaces.",
    data: {
      personalInfo: {
        fullName: "Elena Rostova",
        headline: "Senior Product Designer | UI/UX · Design Systems · Figma · Mobile Apps",
        email: "elena.rostova.design@email.com",
        phone: "+1 (555) 567-8901",
        location: "Berlin, Germany (Open to Remote)",
        linkedinUrl: "https://linkedin.com/in/elena-design",
        portfolioUrl: "https://elenarostova.design",
      },
      professionalSummary:
        "Passionate UI/UX and Product Designer with 5+ years crafting human-centered, accessible digital experiences across web, iOS, and Android platforms. Proven record creating multi-brand design systems that halved front-end handoff discrepancies and redesigned onboarding flows that lifted new user retention by 22%. Expert in Figma, micro-interactions, user research, and WCAG 2.1 AA compliance.",
      workExperience: [
        {
          company: "FinFlow Technologies",
          jobTitle: "Lead UI/UX Designer",
          location: "Berlin, Germany",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Spearheaded comprehensive redesign of mobile banking application (4.8 stars on App Store), improving task completion rates by 31%.",
            "Engineered design token system in Figma synced seamlessly with Tailwind CSS via automated GitHub workflows, saving 15 engineering hours weekly.",
            "Planned and facilitated 40+ usability testing sessions and card-sorting exercises across 5 countries to validate new investment workflows.",
            "Designed accessible color palettes, typography scales, and screen-reader compliant components achieving full WCAG 2.1 AA certification.",
          ],
        },
        {
          company: "Kreativ Studio",
          jobTitle: "Product Designer",
          location: "Munich, Germany",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Delivered end-to-end UX architecture for 8 B2B SaaS clients, designing wireframes, interactive prototypes, and developer-ready specs.",
            "Collaborated with product managers to formulate design sprints, accelerating project kickoff to prototype turnaround by 40%.",
            "Designed micro-interactions and vector illustrations that reduced user error rates on checkout forms by 16%.",
          ],
        },
      ],
      education: [
        {
          degree: "B.A. in Interaction & Visual Communication Design",
          institution: "Bauhaus University Weimar",
          completionDate: "2021",
        },
      ],
      skillCategories: [
        {
          categoryName: "Design & Prototyping",
          skills: ["Figma (Auto-Layout, Variables)", "Wireframing", "High-Fidelity Prototyping", "Design Systems", "Mobile UI (iOS/Android)"],
        },
        {
          categoryName: "Research & Strategy",
          skills: ["User Journey Mapping", "Usability Testing", "Information Architecture", "Heuristic Evaluation", "A/B Test Design"],
        },
        {
          categoryName: "Technical & Standards",
          skills: ["WCAG 2.1 AA Accessibility", "HTML/CSS Fundamentals", "Design Tokens", "Micro-animations", "Zeroheight"],
        },
      ],
      certifications: [
        {
          name: "Nielsen Norman Group UX Master Certified",
          issuer: "NN/g",
          year: "2023",
        },
      ],
    },
  },
  {
    slug: "growth-marketing",
    title: "Growth & Digital Marketing Lead",
    category: "Marketing",
    icon: "📈",
    atsScoreEstimate: 96,
    description: "Growth marketing resume emphasizing CAC/LTV optimization, paid acquisition, SEO revenue engines, and lifecycle email automation.",
    data: {
      personalInfo: {
        fullName: "Jordan Lee",
        headline: "Growth Marketing Manager | Performance Marketing · SEO · Retention · B2B SaaS",
        email: "jordan.lee.growth@email.com",
        phone: "+1 (555) 678-9012",
        location: "Chicago, IL (Open to Remote)",
        linkedinUrl: "https://linkedin.com/in/jordanlee-growth",
        portfolioUrl: "https://jordanleemarketing.com",
      },
      professionalSummary:
        "Analytical Growth Marketing Manager with 5+ years scaling multi-channel acquisition and retention for high-growth B2B SaaS companies. Managed $2.4M in annual paid ad spend while decreasing Customer Acquisition Cost (CAC) by 26% and tripling organic search traffic to 450,000 monthly visits. Expert in Google Ads, Meta Ads, HubSpot marketing automation, and conversion rate optimization (CRO).",
      workExperience: [
        {
          company: "HyperGrowth Analytics",
          jobTitle: "Senior Growth Marketing Manager",
          location: "Chicago, IL",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Oversaw $2.4M annual performance budget across Google Search, LinkedIn Ads, and Meta, driving 18,500 qualified MQLs at a 26% lower CAC.",
            "Architected programmatic SEO strategy publishing 300+ programmatic landing pages, boosting organic inbound demo requests by 140%.",
            "Revamped lifecycle onboarding email sequences in Customer.io, lifting 30-day product trial activation from 14% to 29%.",
            "Established weekly growth experimentation cadence running 45+ landing page conversion tests (VWO) with a 38% win rate.",
          ],
        },
        {
          company: "Elevate SaaS",
          jobTitle: "Digital Acquisition Specialist",
          location: "Minneapolis, MN",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Scaled paid search campaigns from $15K to $85K monthly profitable spend with a 3.8x blended pipeline ROAS.",
            "Authored and distributed high-converting whitepapers and case studies that generated $620K in influenced closed-won revenue.",
            "Configured multi-touch attribution models in Google Analytics 4 and HubSpot, clarifying lead attribution across 7 channels.",
          ],
        },
      ],
      education: [
        {
          degree: "B.S. in Marketing & Data Analytics",
          institution: "University of Illinois Urbana-Champaign",
          completionDate: "2021",
        },
      ],
      skillCategories: [
        {
          categoryName: "Acquisition & Paid Channels",
          skills: ["Google Ads (Search/Display)", "LinkedIn Campaign Manager", "Meta Ads", "Programmatic SEO", "Affiliate Marketing"],
        },
        {
          categoryName: "Analytics & Automation",
          skills: ["Google Analytics 4", "HubSpot", "Customer.io", "Segment", "SQL (Basics)", "Attribution Modeling"],
        },
        {
          categoryName: "Strategy & Experimentation",
          skills: ["Conversion Rate Optimization (CRO)", "A/B Testing", "Funnel Economics (CAC/LTV)", "Email Marketing", "Copywriting"],
        },
      ],
      certifications: [
        {
          name: "Google Ads Search Certified",
          issuer: "Google",
          year: "2024",
        },
        {
          name: "HubSpot Inbound & Revenue Marketing",
          issuer: "HubSpot Academy",
          year: "2023",
        },
      ],
    },
  },
  {
    slug: "fresher-developer",
    title: "Entry-Level / Fresher Software Engineer",
    category: "Early Career",
    icon: "🎓",
    atsScoreEstimate: 95,
    description: "Recruiter-approved fresher developer resume showcasing capstone projects, coding competitions, open-source work, and core CS coursework.",
    data: {
      personalInfo: {
        fullName: "Rahul Sharma",
        headline: "Graduate Software Engineer | React · Python · Java · SQL · Data Structures & Algorithms",
        email: "rahul.sharma.swe@email.com",
        phone: "+91 98765 43210",
        location: "Bangalore, India (Open to Relocation & Remote)",
        linkedinUrl: "https://linkedin.com/in/rahulsharma-swe",
        portfolioUrl: "https://github.com/rahulsharma-code",
      },
      professionalSummary:
        "Enthusiastic and adaptable Computer Science graduate with strong foundations in Data Structures, Algorithms, Object-Oriented Programming, and Modern Web Development. Built and deployed 4 full-stack applications with React, Node.js, and PostgreSQL, including an open-source tool with 350+ GitHub stars. Ranked in top 5% on LeetCode (Solved 400+ problems). Eager to contribute to high-velocity engineering teams.",
      workExperience: [
        {
          company: "TechNova Solutions",
          jobTitle: "Software Engineering Intern",
          location: "Bangalore, India",
          startDate: "Jan 2025",
          endDate: "Jun 2025",
          highlights: [
            "Developed REST API endpoints in Node.js/Express for internal inventory management system, serving 2,000+ daily employee requests.",
            "Refactored legacy React frontend components using modern hooks and Tailwind CSS, improving Lighthouse accessibility score to 98/100.",
            "Wrote comprehensive unit tests using Jest, raising branch test coverage across 12 microservices by 25%.",
            "Participated in daily agile standups, code reviews, and sprint planning sessions.",
          ],
        },
        {
          company: "Open Source Contributor & Capstone",
          jobTitle: "Project Lead – AI Resume Analyzer",
          location: "Bangalore, India",
          startDate: "2024",
          endDate: "2024",
          highlights: [
            "Engineered full-stack resume parsing application using Python FastAPI, spaCy NLP, and React, parsing PDF documents in under 1.2 seconds.",
            "Integrated Gemini AI API for automated ATS keyword matching, receiving 350+ GitHub stars and 1,200 active student users.",
            "Configured CI/CD automated deployment to Vercel and Supabase PostgreSQL with zero downtime.",
          ],
        },
      ],
      education: [
        {
          degree: "B.Tech in Computer Science & Engineering (CGPA: 8.8/10)",
          institution: "National Institute of Technology (NIT)",
          completionDate: "2025",
        },
      ],
      skillCategories: [
        {
          categoryName: "Programming Languages",
          skills: ["JavaScript (ES6+)", "TypeScript", "Python", "Java", "C++", "SQL"],
        },
        {
          categoryName: "Web Technologies & Frameworks",
          skills: ["React.js", "Node.js", "Express.js", "Next.js", "Tailwind CSS", "HTML5/CSS3"],
        },
        {
          categoryName: "Databases & Tools",
          skills: ["PostgreSQL", "MongoDB", "Git & GitHub", "Docker Basics", "Postman", "Linux Command Line"],
        },
      ],
      certifications: [
        {
          name: "Meta Front-End Developer Professional Certificate",
          issuer: "Coursera / Meta",
          year: "2024",
        },
      ],
    },
  },
  {
    slug: "finance-analyst",
    title: "Financial & Investment Analyst",
    category: "Finance",
    icon: "💰",
    atsScoreEstimate: 97,
    description: "Finance resume highlighting financial modeling, DCF valuations, quarterly reporting, variance analysis, and ERP systems.",
    data: {
      personalInfo: {
        fullName: "David Sterling",
        headline: "Financial Analyst | Financial Modeling · DCF · Variance Analysis · Excel/VBA · ERP",
        email: "david.sterling.finance@email.com",
        phone: "+1 (555) 789-0123",
        location: "London, UK (Open to Hybrid/Remote)",
        linkedinUrl: "https://linkedin.com/in/davidsterling-finance",
      },
      professionalSummary:
        "Detail-oriented Financial Analyst with 4+ years evaluating corporate fiscal performance, structuring three-statement financial models, and leading annual budget forecasting across $65M business units. Skilled at synthesizing complex transactional data into executive board presentations and automating manual reporting to cut financial close cycles by 4 business days.",
      workExperience: [
        {
          company: "Crestview Capital Management",
          jobTitle: "Senior Corporate Financial Analyst",
          location: "London, UK",
          startDate: "2023",
          endDate: "Present",
          highlights: [
            "Formulated dynamic DCF (Discounted Cash Flow) and LBO valuation models for 12 M&A acquisition targets totaling £120M in deal value.",
            "Led quarterly variance analysis comparing budget vs actuals across 4 operational divisions, uncovering £420,000 in unbudgeted cost savings.",
            "Built automated Power BI and Excel financial dashboard connected to NetSuite ERP, reducing monthly reporting cycle by 32 hours.",
            "Collaborated with corporate treasury to manage cash flow forecasts ensuring compliance with credit facility covenants.",
          ],
        },
        {
          company: "Apex Global Advisors",
          jobTitle: "Financial Analyst",
          location: "London, UK",
          startDate: "2021",
          endDate: "2023",
          highlights: [
            "Audited capital expenditure proposals (CapEx) calculating IRR, NPV, and payback periods for 30+ enterprise infrastructure investments.",
            "Authored monthly financial commentary reports presented to executive leadership and institutional investors.",
            "Automated accounts reconciliation workflows using advanced Excel VBA macros, mitigating manual data entry errors by 85%.",
          ],
        },
      ],
      education: [
        {
          degree: "B.Sc. in Accounting & Finance (First Class Honours)",
          institution: "London School of Economics (LSE)",
          completionDate: "2021",
        },
      ],
      skillCategories: [
        {
          categoryName: "Financial Modeling & Valuation",
          skills: ["Three-Statement Modeling", "DCF & LBO Valuations", "Variance Analysis", "CapEx/OpEx Planning", "Budgeting & Forecasting"],
        },
        {
          categoryName: "Software & Systems",
          skills: ["Advanced Excel (VBA, Power Query)", "Power BI", "NetSuite ERP", "SAP FICO", "Bloomberg Terminal", "SQL (Basics)"],
        },
        {
          categoryName: "Accounting & Compliance",
          skills: ["IFRS & US GAAP", "Financial Statement Analysis", "Internal Controls", "Treasury & Cash Management"],
        },
      ],
      certifications: [
        {
          name: "CFA Program – Passed Level II",
          issuer: "CFA Institute",
          year: "2024",
        },
        {
          name: "Financial Modeling & Valuation Analyst (FMVA)",
          issuer: "CFI",
          year: "2022",
        },
      ],
    },
  },
];

export function getTemplateBySlug(slug: string): PrefilledTemplateMeta | undefined {
  return PREFILLED_TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplateByRole(roleName: string): PrefilledTemplateMeta {
  const normalized = roleName.toLowerCase();
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);

  // Exact slug or title match
  let found = PREFILLED_TEMPLATES.find(
    (t) => normalized.includes(t.slug) || t.title.toLowerCase().includes(normalized)
  );

  if (found) return found;

  // Keyword token score
  let bestScore = 0;
  let bestTemplate = PREFILLED_TEMPLATES[0];

  for (const t of PREFILLED_TEMPLATES) {
    const haystack = `${t.slug} ${t.title} ${t.category} ${t.description}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (haystack.includes(w)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTemplate = t;
    }
  }

  return bestTemplate;
}
