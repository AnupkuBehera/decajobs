import { BlogPost, DEFAULT_AUTHOR } from "./types";

export const NETWORKING_ARTICLES: Record<string, BlogPost> = {
  "linkedin-profile-optimization": {
    slug: "linkedin-profile-optimization",
    title: "LinkedIn Profile Optimization: Get 10x More Recruiter InMails (2026 Blueprint)",
    category: "LinkedIn",
    excerpt: "Over 90% of tech recruiters use LinkedIn Recruiter as their primary sourcing engine. Learn how to rank at the top of candidate searches with exact formulas.",
    date: "June 1, 2026",
    dateISO: "2026-06-01",
    readingTime: "12 min read",
    author: DEFAULT_AUTHOR,
    faqs: [
      {
        q: "How does the LinkedIn Recruiter search algorithm rank candidates?",
        a: "LinkedIn Recruiter evaluates: keyword exact-match frequency in your Headline and Current Job Title, skills list endorsements, location settings, activity recency, and whether you have enabled 'Open to Work (Recruiters Only)'."
      },
      {
        q: "Should I use the green '#OpenToWork' public photo frame?",
        a: "If currently employed, set 'Open to Work' to 'Recruiters Only' to keep it completely invisible to your colleagues and current boss. If unemployed or a fresher, the public green frame is beneficial as it signals immediate availability."
      },
      {
        q: "What should my LinkedIn headline say if I am currently unemployed or a fresher?",
        a: "Never write 'Actively Seeking Opportunities' or 'Aspiring Software Engineer'. Write your target job title and core tech stack: 'Software Engineer | TypeScript, React, Node.js, PostgreSQL | Building Scalable Cloud Applications'."
      }
    ],
    content: `Over 90% of corporate recruiters and headhunters use LinkedIn Recruiter as their primary tool to find talent. When a company opens a high-paying engineering or product role, the recruiter rarely waits for incoming job applications—they search LinkedIn and send direct **InMails** to the top 20 candidate profiles that appear.

If your profile is not optimized for LinkedIn's internal search algorithm (Recruiter Search SEO), **you are completely invisible to the highest-paying inbound opportunities in the market.**

Here is the exact step-by-step blueprint to optimize your LinkedIn profile and generate 10x more inbound recruiter inquiries in 2026.

**1. The High-Converting Headline Formula (Your Most Critical Real Estate)**
Your headline is the single most algorithmically weighted field on your profile. Never leave it as just your default job title:
❌ *Software Engineer at Tech Corp*
❌ *Passionate Coder | Seeking Opportunities | Quick Learner*

Use the **Triple-Anchor Formula**:
**[Target Role] | [3 Core Technologies / Methodologies] | [Quantified Business Value]**

*Examples:*
- **Backend Developer:** *"Senior Backend Engineer | Go, Python, Kubernetes | Scaling High-Throughput Microservices & Cloud Infrastructure"*
- **Full-Stack Developer:** *"Full-Stack Software Engineer | TypeScript, Next.js, PostgreSQL | Building High-Conversion SaaS Products"*
- **Data Analyst:** *"Data Analyst | SQL, Python, Power BI | Driving Business Insights & Automated ETL Intelligence"*
- **Fresher / Entry-Level:** *"Software Engineer | TypeScript, React, Node.js, SQL | Open Source Contributor & Full-Stack Builder"*

**2. The 'About' Section: Your Professional Story (The Hook, The Proof, The Call-to-Action)**
Structure your About section into three distinct, scannable parts:
- **Part 1: The Hook & Philosophy (2 sentences):** *"I am a software engineer dedicated to building fault-tolerant distributed web applications that solve real-world operational problems. Over the past 4 years, I have architected systems processing millions of daily transactions with zero downtime."*
- **Part 2: Key Career Highlights (Bullet Points with Metrics):**
  - Spearheaded database refactoring, cutting API query latency by 45%.
  - Designed responsive Next.js web application for 250,000 active users.
  - Automated deployment CI/CD workflows, reducing release cycles from 3 hours to 10 minutes.
- **Part 3: Core Technical Proficiencies & Contact:**
  - *Languages & Frameworks:* TypeScript, JavaScript, Python, Go, React, Next.js, Node.js.
  - *Databases & Cloud:* PostgreSQL, Redis, Docker, Kubernetes, AWS.
  - *Contact:* *"Open to high-impact engineering opportunities. Reach me directly at yourname@gmail.com."*

**3. Experience Section: Format for Human Skimmers**
Don't write dense walls of text under each company. Format each role with:
- A 1-sentence description of the team and domain.
- 3 to 5 bullet points following Google's **Action Verb + Context + Quantified Outcome** model.
- A "Skills Used" line tagging the top 5 technologies used in that specific role.

**4. The 50 Skills Maximum: Fill Them All**
LinkedIn allows you to add up to 50 skills. Recruiters use skill filters to narrow searches:
- Pin your top 3 core technical competencies so they appear at the top.
- Include language variants (e.g., add both "JavaScript" and "TypeScript").
- Request skill endorsements from 5 past colleagues or mentors.

**5. Profile Hygiene Settings to Enable Today:**
- **Custom Profile URL:** Change \`linkedin.com/in/john-doe-728b919\` to a clean \`linkedin.com/in/johndoe\`.
- **High-Quality Professional Photo:** A clear, well-lit headshot where your face occupies 60% of the frame with a neutral background.
- **Custom Banner Image:** A clean branded banner showcasing your tech stack, GitHub stats, or a minimalist design reflecting your craft.`
  },

  "linkedin-networking-guide": {
    slug: "linkedin-networking-guide",
    title: "The Art of LinkedIn Cold Messaging: How to Get Referrals Without Being Annoying",
    category: "LinkedIn",
    excerpt: "Employee referrals account for over 40% of all hires. Master the cold outreach formula that gets 60%+ response rates from engineering leads.",
    date: "May 18, 2026",
    dateISO: "2026-05-18",
    readingTime: "11 min read",
    author: DEFAULT_AUTHOR,
    faqs: [
      {
        q: "Why do employees agree to refer strangers on LinkedIn?",
        a: "Most tech companies pay generous employee referral bonuses (often ₹50,000 to ₹2 Lakhs in India, or $2,000 to $5,000 in the US) if their referral gets hired. Employees WANT to refer qualified candidates who make their job effortless."
      },
      {
        q: "Who should I reach out to for a referral: HR or an engineer?",
        a: "Reach out to peer engineers (SDE-2) or Engineering Managers on the target team, NOT HR recruiters. HR inboxes are flooded with thousands of messages daily, while engineers are more receptive to technical peers."
      },
      {
        q: "How many cold messages should I send per week?",
        a: "Aim for 15 to 20 highly personalized messages per week. Sending 100 copy-pasted spam messages will trigger LinkedIn spam detection and burn bridges."
      }
    ],
    content: `Referred applicants are **4 times more likely to get an interview** and **nearly 3 times more likely to receive a job offer** compared to cold portal applicants. Internal referrals bypass the automated ATS algorithmic filters and place your resume directly in the hiring manager's review queue.

Yet most job seekers approach LinkedIn outreach completely wrong, sending low-effort spam messages like:
❌ *"Hi sir, please check my resume and give me any job."*
❌ *"I am desperately looking for a job. Please refer me."*

These messages are deleted instantly. They place all the burden on the recipient to figure out who you are, what open roles exist, and why you are qualified.

Here is the exact cold messaging framework that secures high-conversion employee referrals.

**The 4 Rules of High-Converting Cold Messages:**
1. **Be Hyper-Specific:** Never ask for "any job". Reference an exact open Job ID and title currently posted on their careers page.
2. **Do the Work for Them:** Explain in 2 sentences why your skills match that specific job description.
3. **Make it Frictionless:** Provide a link to your resume and portfolio so they can review it without having to download attachments or ask follow-up questions.
4. **Keep it Under 100 Words:** Long essays get skipped on mobile screens. Brevity signals respect for their time.

**The Winning Cold Referral Message Template:**

*"Hi [First Name],*

*I noticed your engineering team at [Company Name] is scaling and has an open role for [Job Title] (Req #[Job ID]).*

*Over the past [X] years at [Current/Previous Company], I have focused on [1-2 key skills that match the JD, e.g., building distributed microservices in Go and optimizing PostgreSQL queries]. Given that your team is tackling similar scaling challenges, I believe I can make an immediate impact from week one.*

*If you are open to submitting an internal referral, here is my resume link: [Google Drive / DecaJobs Link] and GitHub portfolio: [URL].*

*Either way, thank you for your time and continued great work on [Product Name]!*

*Best regards,*
*[Your Name]"*

**Why This Template Generates 60%+ Response Rates:**
- It proves you did your homework on the company and the exact open requisition.
- It highlights relevant competency without bragging.
- It reminds the employee of their potential referral bonus reward while making submission effortless.

**How to Follow Up Without Being Annoying:**
If you don't hear back after 5 business days, send one gentle follow-up:
*"Hi [First Name], just bumping this in case it got buried under your notifications. No worries at all if you're too swamped right now. Wishing you a great rest of the week!"*

If they still don't respond, let it go gracefully and reach out to another employee on a different squad.`
  },

  "job-application-follow-up-guide": {
    slug: "job-application-follow-up-guide",
    title: "The Perfect Job Application Follow-Up: Timing, Email Templates & Etiquette",
    category: "Job Search Tips",
    excerpt: "Silence after an application or interview does not mean rejection. Learn the exact follow-up timeline and ready-to-send email templates that get replies.",
    date: "June 28, 2026",
    dateISO: "2026-06-28",
    readingTime: "10 min read",
    author: DEFAULT_AUTHOR,
    faqs: [
      {
        q: "How long should I wait before following up on a submitted job application?",
        a: "Wait 7 to 10 business days after submitting an application before following up with the recruiter or hiring manager."
      },
      {
        q: "How soon after an interview should I send a thank-you note?",
        a: "Send a personalized thank-you note within 12 to 24 hours of completing any interview round."
      },
      {
        q: "How many times can I follow up before it becomes harassment?",
        a: "Follow up a maximum of two times. If there is still no reply after the second polite follow-up, consider it a soft rejection and move forward."
      }
    ],
    content: `Silence after submitting a job application or finishing an interview loop can be excruciating. However, silence rarely means an active rejection.

Recruiters manage 15 to 25 open requisitions simultaneously, reviewing hundreds of resumes, scheduling panels, and waiting on executive budget approvals. Very often, your application is simply sitting in a queue waiting for someone to take action.

A timely, professional follow-up email demonstrates persistence, enthusiasm, and organizational communication skills.

**The Strategic Follow-Up Timeline Matrix**
- **Trigger 1: Post-Interview (Within 24 Hours):** Send a personalized thank-you note highlighting a specific technical topic discussed during the interview.
- **Trigger 2: Stated Feedback Date Passes (1-2 Days Later):** If the recruiter said *"You will hear back by Friday"* and Monday arrives with no update, send a polite status inquiry.
- **Trigger 3: General Application Follow-Up (7-10 Days Post-Submission):** Reach out to the talent acquisition lead if you haven't received an automated status update.
- **Trigger 4: The Final Touchpoint (7 Days After Trigger 2):** One final check-in before archiving the opportunity.

**Template 1: The Post-Interview Thank You (Within 24 Hours)**
*Subject: Thank you – [Role Title] Interview – [Your Name]*

*Dear [Interviewer Name],*

*Thank you so much for taking the time to speak with me today about the [Job Title] role. I really enjoyed our discussion regarding [mention specific topic, e.g., your migration to Kafka and how the team handles message deduplication].*

*Our conversation reaffirmed my enthusiasm for joining [Company Name]. I am confident that my background in [relevant technical area] will allow me to make an immediate contribution to [specific goal or milestone].*

*Please let me know if you need any additional portfolio samples or code references from my end. I look forward to the next steps!*

*Best regards,*
*[Your Name]*

**Template 2: Following Up After the Stated Decision Date**
*Subject: Following Up on [Job Title] Interview – [Your Name]*

*Dear [Recruiter Name],*

*I hope your week is going well!*

*I wanted to quickly follow up regarding the [Job Title] position. During our final interview on [Date], you mentioned that the team was hoping to make a decision by [Date].*

*I remain very interested in the opportunity to join the team and help scale [Product / Initiative]. Please let me know if there are any updates regarding the hiring timeline or if there is any additional information I can provide.*

*Thank you for your guidance throughout this process.*

*Warmly,*
*[Your Name]*

**Template 3: Following Up When You Have a Competing Offer**
*Subject: Update Regarding [Job Title] Application – [Your Name]*

*Dear [Recruiter Name],*

*I am writing to share a brief update on my search. I have recently received a written offer from another company with a decision deadline of [Date].*

*However, [Company Name] remains my top choice due to [1 clear reason, e.g., your engineering culture and product focus]. If the team is still interested in my candidacy, I would love to know if it might be possible to expedite the timeline so I can make an informed decision before my deadline.*

*I appreciate your understanding and support!*

*Sincerely,*
*[Your Name]*`
  },

  "how-to-build-professional-network": {
    slug: "how-to-build-professional-network",
    title: "How to Build a Powerful Professional Network in Tech (Without Being Fake)",
    category: "LinkedIn",
    excerpt: "Networking is not collecting vanity business cards or awkward mixer chats. Learn the 'Give-First' compounding relationship system that opens doors for life.",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    readingTime: "11 min read",
    author: DEFAULT_AUTHOR,
    faqs: [
      {
        q: "How can introverted engineers build an effective professional network?",
        a: "Introverts thrive in one-on-one, asynchronous networking: writing thoughtful comments on technical blog posts, contributing to open-source GitHub issues, and sending personalized 1-on-1 direct messages."
      },
      {
        q: "What does 'Give-First' networking mean?",
        a: "'Give-First' means offering value before ever asking for a favor: sharing someone's work, reporting a bug in their open-source tool with a fix, giving feedback on their beta product, or introducing two people who would benefit from knowing each other."
      },
      {
        q: "How often should I stay in touch with people in my network?",
        a: "Aim to reconnect with key relationships once every 3 to 6 months with a low-friction touchpoint: sharing an insightful article, congratulating them on a company milestone, or checking in on a project they mentioned."
      }
    ],
    content: `Many software engineers cringe at the word "networking." They associate it with awkward corporate cocktail hours, aggressive business card distribution, and transactional opportunism where people only reach out when they desperately need a job.

That is amateur networking, and it doesn't work.

**Authentic networking is simply building long-term, genuine friendships with peers who share your professional interests, curiosity, and standards of craft.** When you invest in relationships consistently when you *don't* need anything, you build a compounding moat of goodwill that produces career opportunities for decades.

Here is the sustainable system to build an influential tech network in 2026.

**1. The 80/20 Rule: Focus on Horizontal Peers, Not Celebrities**
Most junior engineers spend their energy trying to message famous CEOs and tech influencers with millions of followers. These outreach attempts have a sub-1% response rate.
- Focus 80% of your networking on **horizontal peers**: colleagues, fellow mid-level developers, hackathon teammates, and engineers 1-2 years ahead of you.
- In 5 years, those peers will be engineering managers, startup CTOs, and founders who will be hiring and making executive decisions.

**2. The 3 Tiers of Value-First Outreach**
Never reach out with an empty "Let's connect and catch up". Provide value upfront:
- **Tier 1: The Insightful Comment:** Leave a thoughtful, analytical comment on someone's technical writeup or LinkedIn breakdown. Point out an interesting edge case or share how you implemented their architectural pattern in your own work.
- **Tier 2: The Beta Tester / Bug Report:** Use an open-source tool or early SaaS product built by an indie engineer. Submit a detailed bug report or pull request fixing documentation typos. Developers love anyone who uses their software.
- **Tier 3: The Knowledge Share:** When you read a game-changing technical paper or engineering blog post, share it with 3 peers saying: *"I thought of your recent work on database caching when I read this article—hope you find it helpful!"*

**3. Build in Public: Attracting Inbound Relationships**
The most efficient way to network is to create content that attracts like-minded engineers to you:
- Document your learning journey: Write short posts on LinkedIn or Twitter detailing a bizarre bug you spent 4 hours troubleshooting and how you fixed it.
- Share architectural diagrams of projects you are building.
- Curate open-source code libraries with clean documentation on GitHub.

**4. The 5-Minute Friday Habit**
Every Friday afternoon, take 5 minutes to send two messages:
1. Message one past coworker: *"Hey [Name], was just thinking about our time at [Company]. Hope you and the team are having a great quarter! How is the [current initiative] going?"*
2. Message one new contact whose work you admire: *"Hey [Name], just wanted to say your recent talk on Kubernetes operators was fantastic. Really appreciated how clearly you explained state reconciliation."*

In 52 weeks, this effortless 5-minute routine creates over 100 warm, genuine professional connections.`
  },

  "github-profile-optimization": {
    slug: "github-profile-optimization",
    title: "How to Optimize Your GitHub Profile to Attract Inbound Tech Recruiters (2026)",
    category: "Career Growth",
    excerpt: "Your GitHub profile is your living engineering transcript. Learn how to design a profile README, curate pinned repositories, and showcase code craftsmanship.",
    date: "July 18, 2026",
    dateISO: "2026-07-18",
    readingTime: "11 min read",
    author: DEFAULT_AUTHOR,
    faqs: [
      {
        q: "Do tech recruiters really look at GitHub profiles?",
        a: "Corporate HR screeners check for an active contribution green graph and project links. Senior tech leads and hiring managers inspect your commit history, code structure, README quality, and test suites before extending interview offers."
      },
      {
        q: "What should I do if my past commercial work was in private enterprise repositories?",
        a: "Enable 'Include private contributions in my profile' under your GitHub profile settings. This displays your full green contribution square activity graph publicly without revealing private company code or repository names."
      },
      {
        q: "What is a GitHub Profile README?",
        a: "A special repository matching your GitHub username (e.g., username/username) that displays a customized markdown homepage at the top of your public profile with your bio, tech stack, and featured projects."
      }
    ],
    content: `For software engineers, data scientists, and DevOps practitioners, your GitHub profile serves as your verifiable digital portfolio. While a resume tells recruiters what you claim you can do, your GitHub repository **proves exactly what you can build, how you structure code, and how you communicate with peers.**

Yet many developers treat their GitHub profile as a digital junkyard: dozens of abandoned tutorial repositories with names like \`test-app-2\`, empty README files, and zero pinned highlights.

Here is how to transform your GitHub profile into a high-converting inbound recruitment funnel.

**1. Create a Master Profile README (username/username)**
GitHub allows you to render a custom markdown banner at the top of your profile:
1. Create a new public repository with the exact same name as your GitHub username.
2. Initialize it with a \`README.md\` file.
3. Structure your profile README with:
   - A bold 2-sentence elevator pitch: *"Hi, I'm [Name] — Full-Stack Engineer specializing in TypeScript, Next.js, Go, and PostgreSQL. Focused on building high-performance distributed systems."*
   - Interactive tech stack badges (using Shields.io).
   - Links to your top 2 featured live applications with demo credentials.
   - Contact links: LinkedIn, personal website, and professional email.

**2. Curate Your 6 Pinned Repositories**
By default, GitHub pins your most recently updated repositories. Pin your top 4 to 6 flagship projects intentionally:
- Ensure every pinned project has a descriptive name (e.g., \`distributed-task-queue\` rather than \`project-final\`).
- Fill out the repository **About** section with a concise summary, key topic tags (e.g., \`typescript\`, \`nextjs\`, \`postgresql\`, \`redis\`), and a live deployment URL.

**3. The Anatomy of an Exceptional Project README**
A technical hiring manager will judge your engineering standards by the quality of your project documentation:
- **Title & Badges:** Build status, test coverage percentage, license.
- **Problem Statement & Demo GIF:** A 5-second animated GIF or screenshot demonstrating the core user flow.
- **Architecture Diagram:** A clear flowchart showing how the frontend, API, database, and background workers communicate.
- **Key Technical Challenges & Trade-offs:** Explain why you chose PostgreSQL over MongoDB or how you handled distributed state synchronization.
- **Local Setup & Automated Testing Commands:** Step-by-step \`git clone\`, \`npm install\`, and \`npm test\` commands that actually work out of the box.

**4. Commit History Hygiene**
Hiring managers inspect your commit log to observe how you collaborate:
- Avoid lazy commit messages like *"update"*, *"fixed stuff"*, or *"wip"*.
- Use Conventional Commits standards: \`feat: implement jwt refresh token rotation\`, \`fix: resolve race condition in wallet debit\`, \`test: add unit tests for redis sliding window\`.
- Show progressive, iterative commits rather than one massive 10,000-line single commit.

**5. Showcase Open Source Contributions**
Even minor open-source contributions carry immense weight:
- Fix typos or broken links in popular open-source documentation.
- Submit bug fixes to active developer libraries.
- Participating in open pull request reviews signals that you understand code review etiquette and collaborative development.`
  }
};
