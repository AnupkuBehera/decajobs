import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles: Record<string, { title: string; content: string; category: string; date: string }> = {
  "top-10-resume-mistakes": {
    title: "Top 10 Resume Mistakes That Get You Rejected (And How to Fix Them)",
    category: "Resume Tips",
    date: "June 2026",
    content: `Recruiters spend an average of just 7 seconds scanning your resume. In that tiny window, common mistakes can instantly disqualify you — no matter how qualified you are. Here are the top 10 resume mistakes and how to fix them:

**1. Generic Objective Statement**
❌ "Seeking a challenging position in a dynamic company"
✅ Replace with a strong professional summary: "Data Analyst with 3 years of experience in SQL, Power BI, and Python, driving 25% efficiency improvements in reporting."

**2. Spelling and Grammar Errors**
Even one typo signals carelessness. Run your resume through Grammarly and ask a friend to proofread.

**3. Too Long (Over 2 Pages)**
Keep it to 1 page for freshers and 2 pages max for experienced professionals. Recruiters don't read 5-page resumes.

**4. No Quantifiable Achievements**
❌ "Managed a team"
✅ "Managed a team of 8 engineers, delivering projects 15% ahead of schedule"

**5. Irrelevant Information**
Remove hobbies like "listening to music" unless they relate to the role. Every line should prove your value.

**6. Poor Formatting**
Use consistent fonts (Arial or Calibri, 10-12pt), clear section headings, and adequate white space. Avoid fancy graphics — they break ATS scanners.

**7. Missing Keywords**
Most companies use Applicant Tracking Systems (ATS). If your resume doesn't contain keywords from the job description, it never reaches a human.

**8. No Action Verbs**
Start bullets with strong verbs: Led, Built, Increased, Reduced, Implemented, Designed — not "Responsible for" or "Worked on."

**9. Including Salary Information**
Never put current or expected salary on your resume. It either prices you out or locks you in.

**10. Outdated Contact Information**
Double-check your email and phone number. An unprofessional email (coolboy99@gmail.com) gets you rejected instantly.

**Pro tip:** Use DecaJobs' free AI Resume Checker to instantly score your resume and get personalized improvement suggestions.`,
  },

  "how-to-crack-any-interview": {
    title: "How to Crack Any Job Interview: The STAR Method + 50 Questions",
    category: "Interview Prep",
    date: "June 2026",
    content: `The STAR method is the gold standard for answering behavioral interview questions. Here's how to use it to ace any interview.

**What is the STAR Method?**
- **S**ituation: Describe the context
- **T**ask: Explain your responsibility
- **A**ction: Detail what you did
- **R**esult: Share the measurable outcome

**Example:**
Q: "Tell me about a time you solved a difficult problem"

"At my previous role at TCS (Situation), our data pipeline was failing 3x per week causing delayed reports (Task). I redesigned the pipeline using Apache Airflow with automated retry logic and alerting (Action). This reduced failures by 95% and saved the team 10 hours per week (Result)."

**Top 10 Most-Asked Questions:**
1. Tell me about yourself
2. What are your strengths and weaknesses?
3. Why do you want this role?
4. Where do you see yourself in 5 years?
5. Tell me about a challenging project
6. How do you handle conflict at work?
7. Why are you leaving your current job?
8. What's your greatest achievement?
9. How do you prioritize tasks?
10. Do you have any questions for us?

**Tips for Success:**
- Research the company thoroughly before the interview
- Prepare 5-7 STAR stories that cover different competencies
- Practice out loud — not just in your head
- Ask 2-3 thoughtful questions at the end
- Send a thank-you email within 24 hours

**Use DecaJobs' free AI Interview Prep tool** to generate role-specific questions with expert tips for any position.`,
  },

  "remote-jobs-guide-india": {
    title: "Complete Guide to Finding Remote Jobs in India (2026)",
    category: "Remote Work",
    date: "June 2026",
    content: `Remote work in India has exploded. Over 40% of tech professionals now work remotely at least part-time. Here's your complete guide to finding and landing remote jobs.

**Where to Find Remote Jobs:**
1. **DecaJobs** — AI-matched remote jobs delivered daily to your inbox
2. **LinkedIn** — Filter by "Remote" in location
3. **Remotive** — Curated remote tech jobs
4. **RemoteOK** — Remote jobs across all industries
5. **AngelList** — Startup remote positions
6. **Naukri** — Filter for Work From Home

**Best Remote-Friendly Companies in India:**
- Atlassian (fully remote)
- Freshworks
- Razorpay
- Zoho
- Automattic (WordPress)
- GitLab (all-remote)
- Toptal
- Buffer

**Remote Job Salary Ranges (India, 2026):**
- Junior Developer: ₹6-12 LPA
- Mid-level Developer: ₹12-25 LPA
- Senior Developer: ₹25-50 LPA
- International Remote (USD): $40,000-$150,000

**How to Stand Out for Remote Roles:**
1. Highlight remote-specific skills: async communication, self-management, documentation
2. Show timezone flexibility in your resume
3. Mention tools: Slack, Notion, Zoom, Jira, Git
4. Include a "Remote Work" section in your profile
5. Build a portfolio/GitHub profile for visibility

**Common Mistakes:**
- Applying to roles requiring visa sponsorship when you want to stay in India
- Not mentioning timezone overlap with the team
- Having a slow internet connection (get backup!)
- Not setting up a professional home office

Set your DecaJobs location to "Remote" and get 10 remote job matches every morning, automatically.`,
  },

  "salary-negotiation-tips": {
    title: "Salary Negotiation: How to Get 20-40% More Than the Initial Offer",
    category: "Salary",
    date: "June 2026",
    content: `Most candidates accept the first offer without negotiating — leaving 20-40% on the table. Here's how to negotiate effectively.

**The Data:**
- 87% of employers expect candidates to negotiate
- Average negotiation increases offer by 15-25%
- Women negotiate 4x less often than men (close this gap!)

**When to Negotiate:**
- After receiving a written offer (not during the interview)
- When you have competing offers (strongest position)
- After they've invested time in you (final rounds)

**The Script:**
"Thank you for the offer — I'm excited about this opportunity. Based on my research and the value I'll bring, I was expecting something in the range of [X-Y]. Is there flexibility on the compensation?"

**Key Strategies:**
1. **Research first**: Use Glassdoor, Levels.fyi, AmbitionBox to know market rates
2. **Give a range, not a number**: "₹18-22 LPA" is better than "₹18 LPA"
3. **Negotiate total comp**: Base + bonus + stocks + WFH stipend + learning budget
4. **Use silence**: After stating your number, stop talking. Let them respond.
5. **Have alternatives**: A competing offer gives you leverage
6. **Be enthusiastic**: Show you want the role while asking for more

**What to Negotiate Beyond Salary:**
- Joining bonus (one-time)
- Stock options / RSUs
- Work from home days
- Learning & development budget
- Title upgrade
- Flexible hours
- Extra vacation days

**Red Flags (Don't Accept):**
- "This is non-negotiable" (it almost never is)
- Verbal offer only (get it in writing)
- Pressure to decide immediately (ask for 48-72 hours)

Use our free Salary Calculator to know your market value before negotiating.`,
  },

  "freshers-job-search-guide": {
    title: "Job Search Guide for Freshers: Land Your First Job in 30 Days",
    category: "Freshers",
    date: "June 2026",
    content: `Landing your first job is the hardest step. Here's a proven 30-day action plan for fresh graduates.

**Week 1: Foundation**
- Day 1-2: Build your resume (use our free AI Resume Checker)
- Day 3: Create/update LinkedIn profile
- Day 4: List 20 target companies in your field
- Day 5-7: Apply to 5 jobs per day on DecaJobs, LinkedIn, Naukri

**Week 2: Build Presence**
- Create a simple portfolio (GitHub for tech, Behance for design)
- Post on LinkedIn 2-3 times about your learnings
- Connect with recruiters and alumni from your college
- Apply to 5 more jobs per day

**Week 3: Network & Follow Up**
- Attend virtual career fairs / webinars
- Message hiring managers directly on LinkedIn (politely)
- Follow up on Week 1 applications
- Start interview prep with STAR method

**Week 4: Interview & Close**
- Practice mock interviews (use our AI Interview Prep tool)
- Prepare questions for each company
- Send personalized thank-you notes after interviews
- Negotiate offers (yes, even freshers can negotiate!)

**Fresher Resume Tips:**
- Lead with education + relevant coursework
- Highlight internships, projects, and certifications
- Include tech skills prominently
- Keep it to 1 page
- Add links: GitHub, portfolio, LinkedIn

**Best Companies Hiring Freshers (2026):**
- TCS, Infosys, Wipro (mass hiring)
- Startups on AngelList (faster growth)
- Product companies: Razorpay, Swiggy, Zerodha
- Remote-first: Automattic, Toptal, Turing

**How Many Applications to Send?**
Target 100 applications minimum. The average fresher conversion rate is 2-5%, so you need volume.

Sign up for DecaJobs and get 10 fresher-friendly jobs matched to your skills every morning — no scrolling required.`,
  },

  "linkedin-profile-optimization": {
    title: "LinkedIn Profile Optimization: Get 10x More Recruiter Views",
    category: "LinkedIn",
    date: "June 2026",
    content: `93% of recruiters use LinkedIn to find candidates. Here's how to make your profile stand out.

**Headline (Most Important)**
❌ "Student at XYZ University"
✅ "Data Analyst | SQL • Python • Power BI | Building data-driven solutions"

Formula: [Role] | [Top 3 Skills] | [Value Proposition]

**Profile Photo**
- Professional headshot (not a selfie)
- Face takes up 60% of frame
- Simple background
- Smiling and approachable
- Profiles with photos get 21x more views

**Summary (About Section)**
Structure:
1. Who you are (1 sentence)
2. What you do (2-3 sentences)
3. Key achievements (bullets)
4. What you're looking for (1 sentence)
5. Call to action (email or "Let's connect")

**Experience Section**
- Start each bullet with action verbs
- Include numbers: "Increased revenue by 25%", "Managed ₹2Cr budget"
- Add media: presentations, articles, projects
- Keep descriptions concise (3-5 bullets per role)

**Keywords Strategy**
LinkedIn search works like SEO. Include keywords that recruiters search:
- Put them in: Headline, About, Experience, Skills
- Research keywords: Look at 10 job descriptions for your target role and extract common terms

**Skills & Endorsements**
- Add 20+ relevant skills
- Pin your top 3 (most important)
- Ask colleagues to endorse you

**Activity (The Secret Weapon)**
- Post 2-3 times per week (even sharing articles counts)
- Comment on industry posts
- Active profiles get 5x more recruiter InMails

**Open to Work Feature**
- Turn it ON (visible to recruiters only, not your current employer)
- Specify: Job titles, locations, start date
- This alone increases recruiter messages by 40%

Optimize your LinkedIn, then let DecaJobs handle the rest — we scan LinkedIn jobs and deliver your top 10 matches daily.`,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return { title: "Not Found" };

  return {
    title: `${article.title} | DecaJobs Blog`,
    description: article.content.slice(0, 160),
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) notFound();

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-primary-600 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>

        <article>
          <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 mb-3">
            {article.category}
          </span>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{article.date} · 5 min read</p>

          <div className="mt-8 prose prose-neutral prose-sm sm:prose-base max-w-none">
            {article.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{paragraph.replace(/\*\*/g, "")}</h2>;
              }
              if (paragraph.startsWith("**")) {
                const parts = paragraph.split("**");
                return (
                  <p key={i} className="mb-4">
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
                  </p>
                );
              }
              if (paragraph.startsWith("- ") || paragraph.startsWith("1. ")) {
                const items = paragraph.split("\n");
                return (
                  <ul key={i} className="list-disc pl-5 mb-4 space-y-1">
                    {items.map((item, j) => <li key={j} className="text-neutral-700">{item.replace(/^[-\d.]\s*/, "")}</li>)}
                  </ul>
                );
              }
              if (paragraph.startsWith("❌") || paragraph.startsWith("✅")) {
                return <p key={i} className="mb-2 text-neutral-700">{paragraph}</p>;
              }
              return <p key={i} className="mb-4 text-neutral-700 leading-relaxed">{paragraph}</p>;
            })}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-primary-50 border border-primary-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-neutral-900">Ready to supercharge your job search?</h3>
          <p className="mt-2 text-sm text-neutral-600">Get 10 AI-matched jobs delivered to your inbox every morning. Free to start.</p>
          <Link href="/login" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
            Start Getting Matched Jobs →
          </Link>
        </div>
      </div>
    </div>
  );
}
