import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";

const articles: Record<string, { title: string; content: string; category: string; date: string; dateISO: string; author: string; authorRole: string; readingTime: string }> = {
  "top-10-resume-mistakes": {
    title: "Top 10 Resume Mistakes That Get You Rejected (And How to Fix Them)",
    category: "Resume Tips",
    date: "June 12, 2026",
    dateISO: "2026-06-12",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
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
    date: "June 10, 2026",
    dateISO: "2026-06-10",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "7 min read",
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
    date: "June 8, 2026",
    dateISO: "2026-06-08",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "8 min read",
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
    date: "June 5, 2026",
    dateISO: "2026-06-05",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "7 min read",
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
    date: "June 3, 2026",
    dateISO: "2026-06-03",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "7 min read",
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
    date: "June 1, 2026",
    dateISO: "2026-06-01",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "8 min read",
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

  "ats-resume-secrets": {
    title: "How to Beat the ATS (Applicant Tracking System): Secrets from Recruiters",
    category: "Resume Tips",
    date: "May 28, 2026",
    dateISO: "2026-05-28",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `More than 95% of major employers use Applicant Tracking Systems (ATS) to filter resumes before they reach human eyes. If your resume isn\u0027t optimized for these databases, you are applying into a black hole. Here are the secrets to beating the ATS:

**1. Format for Scanners, Not Humans**
Fancy templates, tables, graphics, progress bars, and dual-column layouts might look pretty, but they crash ATS parsers. Keep your resume in a clean, single-column layout using standard fonts like Arial, Calibri, or Helvetica.

**2. Match the Job Title Exactly**
If the job posting is for a \u0022Software Engineer II\u0022 and your resume says \u0022Web Developer,\u0022 the system might rank you lower. Align your job titles with the target role where reasonable, or put the target role title in your professional summary.

**3. Optimize Your Skills Section**
Copy the skills verbatim from the job description. If the posting mentions \u0022Project Management\u0022 and you wrote \u0022Managing Projects,\u0022 the ATS may miss the match. Use exact matches for both hard and soft skills.

**4. Don\u0027t Hide Keywords in White Font**
A common \u0022hack\u0022 is to paste the job description in white font at the bottom of the resume. Modern ATS systems parse all text into a single plain-text string, which means recruiters will see your hidden block of keywords. Doing this gets you blacklisted immediately.

**5. Keep It in PDF or Word Format**
Unless specified otherwise, PDF is the safest format to preserve your layout. However, some legacy ATS platforms handle Microsoft Word (.docx) files better. If in doubt, upload a cleanly formatted PDF.

**Pro tip:** Prioritize experience sections with bullet points starting with strong action verbs. Keep your resume clean and structured.`,
  },

  "artificial-intelligence-careers": {
    title: "How AI is Changing the Job Market: Top Skills to Learn in 2026",
    category: "Career Growth",
    date: "May 25, 2026",
    dateISO: "2026-05-25",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `Artificial Intelligence is no longer a future trend — it is actively reshaping careers and job descriptions across every sector in 2026. To remain competitive, job seekers must pivot from fearing automation to leveraging AI tools. Here are the top skills you need:

**1. AI Tool Literacy**
Whether you are in marketing, engineering, or design, you must master role-specific AI tools. Software engineers need GitHub Copilot, marketers need ChatGPT and Midjourney, and analysts need AI-powered BI tools.

**2. Prompt Engineering**
Knowing how to write precise instructions (prompts) to get high-quality outputs from Large Language Models (LLMs) is a highly valued skill. Learn structuring techniques, system prompts, and how to programmatically interact with AI APIs.

**3. Data Interpretation and Analytics**
With AI generating massive volumes of automated reports, companies need professionals who can synthesize, audit, and interpret data to make strategic decisions. Understanding basic SQL, Python, and statistical modeling is critical.

**4. Soft Skills are Your Moat**
Skills that AI cannot replicate are in higher demand than ever: critical thinking, emotional intelligence, complex problem solving, leadership, and high-impact communication. Emphasize these on your profile.

**5. Continuous Adaptability**
The tech stack you use today will change in 12 months. The most important skill in 2026 is the ability to learn new tools and paradigms quickly. Highlight how you adapt and pick up new tools on your resume.

**Pro tip:** Include a \u0022Technologies \u0026 Tools\u0022 section on your resume and list the AI platforms you have integrated into your workflow.`,
  },

  "remote-job-interview-prep": {
    title: "Remote Job Interviews: 10 Tips to Ace Your Video and Tech Rounds",
    category: "Interview Prep",
    date: "May 22, 2026",
    dateISO: "2026-05-22",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `Remote interviews require a different strategy than in-person meetings. Technical setups, communication cues, and body language all translate differently over a webcam. Follow this 10-step guide to ace your next video interview:

**1. Test Your Tech Setup Early**
Don\u0027t wait until 5 minutes before the call. Double-check your webcam, microphone, internet stability, and the video platform (Zoom, Teams, Google Meet) at least 30 minutes before the interview.

**2. Set Up Professional Lighting**
Position your main light source in front of you (behind your webcam) so your face is clearly illuminated. Avoid backlighting (like sitting in front of a window), which turns you into a dark silhouette.

**3. Choose a Clean, Quiet Background**
Conduct the interview in a quiet room with a neutral background. If your room is cluttered, use a clean virtual background or a subtle blur effect to avoid distracting the interviewer.

**4. Maintain Virtual Eye Contact**
Look directly into your camera, not at the interviewer\u0027s face on your screen, when speaking. This creates the visual effect of looking the interviewer in the eye, conveying confidence and engagement.

**5. Dress Professionally**
Dress fully in professional attire, even if you are interviewing from your bedroom. It shifts your mindset into work mode and prepares you for any unexpected situation where you might need to stand up.

**6. Prepare Digital Cheat Sheets**
Keep your resume, the job description, and your STAR response notes open on a split screen or printed in front of you. This allows you to reference key projects without looking away from the camera.

**7. Minimize Background Noise**
Turn off fans, close windows, mute notifications on your phone and computer, and notify family members or flatmates that you will be in an important meeting.

**8. Practice Active Listening Cues**
Because video calls have a slight latency, nod and smile to show you are engaged instead of using verbal filler words (like \u0022mm-hmm\u0022) which can interrupt the audio stream.

**9. Have a Backup Plan**
If your internet fails, have your phone hotspot ready. Keep the recruiter\u0027s phone number or email handy to notify them immediately of any technical emergencies.

**10. Send a Follow-Up Note**
Within a few hours of finishing the call, send a thank-you email highlighting a specific conversation point to show interest and promptness.`,
  },

  "career-gaps-explanation": {
    title: "How to Explain Career Gaps in a Job Interview (With Examples)",
    category: "Interview Prep",
    date: "May 20, 2026",
    dateISO: "2026-05-20",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `A gap on your resume is not the dealbreaker it used to be. In 2026, recruiters recognize that career paths are rarely linear. Whether you took time off for family, health, travel, or upskilling, here is how to explain it with confidence:

**1. Be Honest and Brief**
Do not try to hide the gap or over-explain it. State the reason clearly, keep it to one or two sentences, and immediately pivot to what you did during that time or why you are ready to return.

**2. Pivot to Upskilling \u0026 Freelancing**
Highlight any productive activities you engaged in during your break. Did you take certification courses? Build open-source side projects? Work on freelance gigs? This shows you kept your skills sharp.

**3. Use the Focus-Future Formula**
Frame your response using this structure:
1. Explain the gap briefly (Past)
2. Share what you learned or how you grew (Present)
3. Connect it to your readiness for this new role (Future)

**Example for Family Caregiving:**
\u0022I took a career break to care for an ailing family member. During this period, I also dedicated 10 hours a week to completing an advanced React certification. My family situation is now fully resolved, and I am excited to bring my updated frontend skills to this engineering team.\u0022

**Example for Upskilling/Career Transition:**
\u0022I stepped away from my previous marketing role to complete an intensive 6-month Data Analytics bootcamp. I wanted to focus fully on mastering Python, SQL, and Power BI so I could pivot into data-driven strategy roles, which brings me to this opportunity.\u0022

**Pro tip:** Update your resume with a brief entry explaining the gap (e.g., \u0022Career Break - Professional Development\u0022 or \u0022Freelance Consultant\u0022) so the ATS doesn\u0027t automatically filter you out for gaps.`,
  },

  "linkedin-networking-guide": {
    title: "The Art of LinkedIn Cold Messaging: How to Get Referrals Without Being Annoying",
    category: "LinkedIn",
    date: "May 18, 2026",
    dateISO: "2026-05-18",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `Applying to jobs online has a conversion rate of just 2-5%. Networking and securing internal referrals, however, boosts your chance of getting an interview by over 10x. Here is how to message professionals on LinkedIn and get replies:

**1. Don\u0027t Just Ask for a Job or Referral Immediately**
Sending a connection request with \u0022Hi, please refer me to job ID 12345\u0022 is spammy and rarely works. Build a connection first. People refer candidates they trust and like.

**2. Target the Right People**
Reach out to peers (e.g., Senior Developers if you are a Junior Developer) or alumni from your college. They are much more likely to reply and offer guidance than busy HR executives or high-level Directors.

**3. Keep Your First Message Under 100 Words**
A short, personalized message has a 3x higher response rate. Introduce yourself, state why you are reaching out, and ask for a quick 10-minute informational chat.

**Example Template:**
\u0022Hi [Name], I saw your posts on React rendering optimization and really enjoyed your insights. I\u0027m a frontend engineer looking to transition into SaaS development. I\u0027d love to ask you 2 quick questions about how your team structures its workflows. Do you have 5 minutes for a quick chat next week?\u0022

**4. Ask for Advice, Not an Active Job**
People love giving advice, but they are hesitant to give job referrals to strangers. Ask about their career journey, their team\u0027s stack, or advice for entering the field. At the end of a good conversation, the referral will naturally follow.

**5. Follow Up Politely**
If they don\u0027t reply, don\u0027t take it personally. People are busy. Send one polite follow-up message 5-7 days later, and if they still don\u0027t respond, move on to other connections.

**Pro tip:** Make sure your LinkedIn profile is fully optimized before networking, as everyone you message will click on your profile first.`,
  },

  "negotiating-first-salary": {
    title: "Fresher Salary Negotiation: Yes, You Can (And Should) Ask For More",
    category: "Salary",
    date: "May 15, 2026",
    dateISO: "2026-05-15",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `One of the biggest career mistakes fresh graduates make is accepting their first job offer without negotiating. Many freshers assume negotiation is only for experienced professionals or fear they will lose the offer. In reality, you can and should negotiate:

**1. Employers Expect It**
Hiring budgets always have some flexibility. Even for entry-level roles, companies leave a buffer of 10% to 15% in their initial offer, anticipating that candidates might ask for more.

**2. Negotiation Won\u0027t Lose You the Offer**
As long as you are polite, professional, and base your request on market data, a company will not retract a job offer just because you negotiated. The worst they will say is, \u0022This is our final budget.\u0022

**3. Use Market Benchmarks**
Do your research. Calculate the average entry-level salary for your role and location using our Salary Calculator, Glassdoor, and AmbitionBox. Frame your request around this data.

**Negotiation Script:**
\u0022Thank you for this offer — I am thrilled to join the team. Based on my research for similar entry-level roles in Bangalore and the advanced project portfolio I shared, I was hoping we could explore a compensation closer to ₹8 LPA. Is there any flexibility in the base salary?\u0022

**4. Highlight Your Specific Skills**
If you have completed relevant internships, won hackathons, or hold advanced certifications (e.g., AWS, Salesforce), use them as leverage. Explain how these skills allow you to contribute from day one without extensive training.

**5. Look at the Total Package**
If the base CTC is non-negotiable, ask about relocation allowances, joining bonuses, remote work stipends, or performance bonus guarantees. A one-time joining bonus is often easier for HR to approve.

**Pro tip:** Keep your tone positive and collaborative. Negotiation is not a conflict; it is a conversation to find a mutually beneficial agreement.`,
  },

  "how-to-answer-salary-expectations": {
    title: "How to Answer \u0022What Are Your Salary Expectations?\u0022 (Scripts Included)",
    category: "Salary",
    date: "July 10, 2026",
    dateISO: "2026-07-10",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `"What are your salary expectations?" is one of the most dreaded interview questions — and also one of the most important. Answer too high and you price yourself out. Answer too low and you leave money on the table for years. Here is exactly how to handle it.

**Why Recruiters Ask This Question**
Recruiters ask to filter candidates early, manage their hiring budget, and gauge whether you understand your market value. It's a screening question, not a commitment. Your goal is to keep your options open while signaling you know what you're worth.

**The Golden Rule: Delay Your Number**
Whenever possible, avoid giving a specific number first. Instead, say:
"I'd love to learn more about the scope and responsibilities of the role first. Could you share the budget range you have in mind for this position?"
Many recruiters will reveal their range. If they do, you can position yourself within it. If they insist you go first, give a range based on research — not a single number.

**The Research-Backed Range Script**
"Based on my research for similar roles in this location with my experience level, and considering my skills in [Skill A] and [Skill B], I'm targeting a base salary in the range of ₹X to ₹Y. I'm flexible depending on the total compensation package."
Why a range? A single number locks you in. A wide range (like ₹18-22 LPA) shows flexibility while anchoring at a strong midpoint.

**If They Ask About Your Current Salary**
In many regions, asking about current salary is becoming less common. If it comes up, you can say:
"I'd prefer to focus on the value I'll bring to this role rather than my past compensation. Based on market benchmarks for this position, I'm looking at ₹X to ₹Y."
This pivots the conversation from your history to the role's value.

**What If the Number They Offer Is Low?**
Don't reject it outright. Say: "Thank you — I'm excited about the opportunity. Based on the market rate and the scope of the role, I was expecting something closer to ₹X. Is there flexibility to bridge this gap?" Most employers have a buffer and respect candidates who negotiate professionally.

**Common Mistakes to Avoid**
- Giving a single number instead of a range
- Saying "I don't know" or "whatever you think is fair"
- Stating a number with no justification
- Negotiating before you have a written offer
- Forgetting to consider benefits, bonuses, and equity in the total package

**Use Data, Not Guesswork**
Before any interview, benchmark your role using our free Salary Calculator and platforms like Glassdoor, Levels.fyi, and AmbitionBox. Knowing the 25th, 50th, and 75th percentile for your role and location gives you a defensible anchor.

**Pro tip:** Always frame your expectations around market data and the value you bring — never around your personal expenses or needs.`,
  },

  "best-skills-to-learn-2026": {
    title: "The Best Skills to Learn in 2026 to Future-Proof Your Career",
    category: "Career Growth",
    date: "July 8, 2026",
    dateISO: "2026-07-08",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "7 min read",
    content: `The job market in 2026 rewards people who combine deep expertise with adaptability. Automation and AI are reshaping roles faster than ever, but they're also creating entirely new categories of work. Here are the skills that will give you the strongest career leverage this year.

**1. AI Literacy and Tool Proficiency**
You don't need to be a machine learning engineer to benefit from AI — but you do need to know how to use AI tools in your daily work. Every professional should be comfortable with at least one LLM assistant, one AI coding tool (if you're technical), and AI-powered analytics. The people who use these tools to become 2-3x more productive are the ones getting promoted.

**2. Prompt Engineering and AI Workflows**
Knowing how to write precise, structured prompts is becoming a core skill across marketing, engineering, design, and operations. Learn how to break complex tasks into sub-prompts, provide context, and chain AI outputs into workflows. This skill directly translates into output quality.

**3. Data Interpretation**
As AI generates more automated reports, the differentiator is the human who can interpret, challenge, and act on the data. Basic SQL, spreadsheet modeling, and statistical reasoning will keep you valuable regardless of your field.

**4. Emotional Intelligence and Communication**
Skills AI cannot easily replicate — empathy, negotiation, persuasion, and leadership — are in higher demand than ever. Companies pay a premium for people who can facilitate meetings, manage stakeholders, and build trust.

**5. Continuous Learning Systems**
The most future-proof skill is the ability to learn quickly. Build a personal system: dedicate 1 hour per week to structured learning, keep a "learning portfolio" of projects, and document your growth. Hiring managers increasingly look for evidence of adaptability over static credentials.

**6. Specialized Technical Skills in High Demand**
- Cloud: AWS, Azure, GCP (with Kubernetes and Terraform)
- Data: Python, SQL, and modern BI tools
- Security: basic cybersecurity awareness is now expected in every tech role
- Product: analytics-driven product thinking and experimentation

**How to Choose What to Learn**
Start with the role you want, not the skill you find easiest. Open 10 job descriptions for your target role and list the top 10 recurring skills. Learn the top 3 you don't already have, and build a small project that demonstrates each one.

**Pro tip:** Add a "Technologies & Tools" section to your resume and list the AI platforms you use. It signals to recruiters that you're current, not outdated.`,
  },

  "how-to-write-resume-summary": {
    title: "How to Write a Resume Summary That Gets Interviews (10 Examples)",
    category: "Resume Tips",
    date: "July 5, 2026",
    dateISO: "2026-07-05",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `Your resume summary is the first thing a recruiter reads — and often the only thing. A strong summary tells the reader who you are, what you do, and what you've achieved in 3-4 lines. A weak one gets your resume skipped. Here's how to write one that opens doors.

**What a Resume Summary Is (and Isn't)**
A summary is a concise overview at the top of your resume that positions you for your target role. It is NOT an objective statement ("Seeking a challenging position...") and NOT your life story. It's a marketing pitch, backed by evidence.

**The Formula: Role + Experience + Key Skills + Top Achievement**
"[Job Title] with [X] years of experience in [field]. Proven track record of [key achievement]. Skilled in [3 core skills]. Looking to bring [specific value] to a [type of company]."

**Example 1: Experienced Data Analyst**
"Data Analyst with 4 years of experience transforming complex datasets into actionable insights. Improved reporting accuracy by 30% and reduced manual analysis time by 15 hours/week through automated dashboards. Proficient in SQL, Python, Power BI, and Tableau."

**Example 2: Fresher / Entry Level**
"Computer Science graduate with hands-on project experience in React, Node.js, and MongoDB. Built 6 full-stack projects, including a job-tracking app used by 200+ students. Seeking a Frontend Developer role where strong problem-solving and rapid learning can contribute from day one."

**Example 3: Career Changer**
"Marketing professional with 5 years of experience pivoting into product management. Led 12 cross-functional campaigns and translated customer insights into roadmap priorities. Certified Product Manager with hands-on experience in analytics and user research."

**Example 4: Senior Leader**
"Engineering Leader with 12 years of experience scaling teams from 5 to 50 engineers. Reduced infrastructure costs by 40% while improving deployment frequency 5x. Passionate about building inclusive, high-performing teams."

**What Makes a Summary Effective**
- It's tailored to the specific job (never send the same summary everywhere)
- It contains numbers and measurable outcomes
- It uses keywords from the job description (ATS critical)
- It's 3-4 lines max — recruiters skim
- It avoids clichés like "hardworking," "team player," and "go-getter"

**Common Mistakes**
- Using an objective statement instead of a summary
- Listing responsibilities instead of achievements
- Being vague ("experienced professional with diverse skills")
- Including personal details (age, marital status, hobbies)
- Writing a wall of text

**Pro tip:** Paste your resume into our free AI Resume Checker to get an instant score and personalized suggestions for your summary section.`,
  },

  "remote-work-tools-guide": {
    title: "The Essential Remote Work Tools Guide: Software & Gadgets for 2026",
    category: "Remote Work",
    date: "July 2, 2026",
    dateISO: "2026-07-02",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `Working remotely isn't just about a laptop and Wi-Fi. The right set of tools can be the difference between a productive, connected remote career and one that feels isolating and chaotic. Here's the essential toolkit every remote professional needs in 2026.

**Communication: The Backbone of Remote Work**
- Slack: Team chat, channels, and integrations. Learn to use threads, statuses, and do-not-disturb modes.
- Microsoft Teams: Common in enterprise and education. Master meeting scheduling and document collaboration.
- Zoom / Google Meet: For video calls. Test your audio and camera before every important meeting.

**Project Management & Async Work**
- Notion: All-in-one workspace for notes, wikis, docs, and simple project tracking.
- Trello / Asana: Visual kanban boards for task management and team workflows.
- Jira: The standard for software teams. Understand tickets, sprints, and agile boards.

**Documentation & Knowledge Sharing**
- Confluence / Notion: Where teams document processes, decisions, and how-tos.
- Google Workspace: Docs, Sheets, Slides, and Drive — the universal standard for real-time collaboration.

**Personal Productivity**
- Todoist / TickTick: Task management for your personal to-do list.
- Toggl / Clockify: Time tracking to understand where your hours actually go.
- Focus apps: Pomodoro timers and distraction blockers (like Forest) help maintain deep work.

**Hardware Essentials**
- A quality headset with noise cancellation (crucial for calls)
- A secondary monitor (productivity boost of 20-30%)
- A stable wired internet connection for video calls
- A comfortable chair — you'll spend hours in it
- An external webcam and microphone if your laptop quality is poor

**Setting Up Your Home Office**
1. Choose a dedicated space with a door if possible
2. Face a window or a well-lit area (light in front of you, not behind)
3. Use a neutral, clean background for video calls
4. Invest in cable management to reduce visual clutter
5. Establish boundaries: set work hours and communicate them to household members

**Reducing Distractions**
- Use separate browser profiles for work and personal
- Turn off non-essential notifications during deep work
- Batch-check email 2-3 times a day instead of continuously
- Take real breaks — step away from the screen

**Pro tip:** Mention your remote toolset (Slack, Notion, Zoom, Jira) in your resume. Employers look for candidates who already know how to work in distributed environments.`,
  },

  "job-application-follow-up-guide": {
    title: "The Perfect Job Application Follow-Up: Timing, Templates & Etiquette",
    category: "Job Search Tips",
    date: "June 28, 2026",
    dateISO: "2026-06-28",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "5 min read",
    content: `You've submitted your application. Now what? Most candidates simply wait — and waiting rarely gets you noticed. A well-timed, professional follow-up can move your application to the top of the pile. Here's exactly how to do it without being annoying.

**Why Follow-Ups Work**
Recruiters manage dozens of open roles and hundreds of applications. Yours can get lost. A polite follow-up demonstrates interest, initiative, and professionalism — three traits every employer wants. Done right, it keeps you top-of-mind.

**The Follow-Up Timeline**
- Day 0: Submit your application
- Day 7: Send a brief check-in email (if the job is still open)
- Day 14: Send a second, final follow-up
- Day 21+: Move on unless they respond

**The Day-7 Template**
Subject: Following up on [Job Title] application — [Your Name]
"Hi [Name], I hope you're doing well. I applied for the [Job Title] position on [Date] and wanted to briefly follow up. I'm very excited about the opportunity to contribute to [Company]'s work in [area], and I believe my experience with [Skill] would be a strong fit. Please let me know if there's anything else I can provide. Thanks for your time!"

**The Day-14 Template (Final)**
"Hi [Name], I wanted to check in one more time regarding my application for [Job Title]. I completely understand you're busy, and I just wanted to reiterate my enthusiasm for the role. If the position has been filled, I'd appreciate a quick note so I can adjust my search. Thanks again!"

**Etiquette Rules**
- Never follow up more than twice
- Always reply to the same email thread
- Keep it under 150 words
- Don't call or message on social media unless you have an existing connection
- Stay positive — never express frustration

**What to Do While Waiting**
Don't pause your job search. Keep applying, keep networking, and keep interviewing. The candidate who follows up AND has multiple options is in the strongest position.

**Bonus: The Post-Interview Thank-You**
Send a thank-you email within 24 hours of any interview. Reference one specific topic you discussed and reiterate your interest. This small step measurably increases your chances of moving forward.

**Pro tip:** Track every application — where you applied, when, and your follow-up dates. DecaJobs' application tracker makes this easy, and it's built into your free dashboard.`,
  },

  "how-to-build-professional-network": {
    title: "How to Build a Professional Network That Gets You Hired",
    category: "LinkedIn",
    date: "June 25, 2026",
    dateISO: "2026-06-25",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `They say it's not what you know, it's who you know — and data backs it up. Referrals dramatically increase your chances of getting an interview. But building a genuine professional network doesn't mean spamming hundreds of strangers with connection requests. Here's a sustainable approach.

**Why Networking Matters for Your Job Search**
- Referred candidates are 3-5x more likely to get hired than cold applicants
- 70-80% of jobs are never publicly posted
- Recruiters check your network before reaching out
- People hire people they trust and like

**Start With Your Existing Network**
Before looking outward, map your current connections: former colleagues, classmates, alumni, managers, clients, and mentors. Most people find their next job through a second-degree connection — someone who knows someone.

**The 5-Day Networking Plan**
Day 1: List 20 people in your target industry (alumni + colleagues + LinkedIn connections)
Day 2: Send 5 personalized connection requests
Day 3: Have 2 informational conversations
Day 4: Follow up with a thank-you and offer something of value
Day 5: Repeat. Consistency beats intensity.

**How to Write a Connection Request That Gets Accepted**
"I'm [Name], a [Role] working in [Industry]. I noticed we're both alumni of [University] / share an interest in [Topic]. I'm building my network in [Field] and would value connecting. I'll keep it professional."

**The Informational Interview**
Ask for 15-20 minutes, not a job. Prepare 5 questions about their career journey, their industry, and their advice. At the end, ask: "Who else should I talk to?" This grows your network exponentially.

**Give Before You Get**
Networking is reciprocal. Share useful articles, introduce people to each other, and offer help before asking for favors. People remember those who helped them.

**Maintain Your Network**
- Comment meaningfully on posts (not just "Great post!")
- Send a note when someone gets promoted or changes jobs
- Check in every 3-6 months — not just when you need something
- Celebrate others' wins publicly

**Pro tip:** A fully optimized LinkedIn profile is your networking foundation. Use our LinkedIn Headline Generator to craft a profile that makes recruiters want to connect with you.`,
  },

  "switching-careers-guide": {
    title: "How to Switch Careers in 2026: A Step-by-Step Pivot Guide",
    category: "Career Growth",
    date: "June 22, 2026",
    dateISO: "2026-06-22",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "7 min read",
    content: `Switching careers feels risky, but it's also one of the most rewarding moves you can make. Whether you're moving from marketing to data analytics, teaching to tech, or finance to product, a successful pivot follows a repeatable process. Here's the step-by-step guide for 2026.

**Step 1: Define Your Target Role (Not Just an Industry)**
Pick a specific role title, not a vague industry. "I want to work in tech" is too broad. "I want to become a Data Analyst in a SaaS company" is actionable. Research 10 job descriptions for your target role and note the recurring skills and requirements.

**Step 2: Identify Your Transferable Skills**
You have more relevant experience than you think. Common transferable skills include:
- Communication and writing
- Project and stakeholder management
- Data literacy and analysis
- Problem-solving and critical thinking
- Budgeting and operations
Map each of your current skills to the target role's requirements.

**Step 3: Fill the Gaps Strategically**
You don't need a full degree to pivot — you need evidence of the core skills. Take 1-2 targeted courses or certifications, then build 2-3 small projects that demonstrate those skills. A portfolio of real projects beats a certificate alone.

**Step 4: Reposition Your Resume**
Frame your experience around the target role, not your old title. Use a functional or hybrid resume format that leads with transferable skills. Every bullet should answer: "How does this prove I can do the new role?"

**Step 5: Network Into the Field**
Attend industry events (virtual or in-person), connect with people in your target role, and ask for informational interviews. Many career changers find their first role through referrals, not applications.

**Step 6: Be Ready to Start Slightly Lower**
Career pivots often require a step back in title or salary for 1-2 years. Plan for it. The long-term ceiling in a role you love will almost always exceed staying in a role you've outgrown.

**Step 7: Tell a Compelling Story**
In interviews, you'll be asked why you're switching. Prepare a confident narrative: "I excelled in [old field], but I discovered my passion lies in [new field]. I've spent the last [X months] building [skills/projects] to make this move, and here's proof."

**Common Pivot Mistakes**
- Jumping without research (network first!)
- Applying to jobs before building any evidence
- Hiding the career change on your resume
- Waiting for "the perfect time" (there's no such thing)

**Pro tip:** Use our AI Resume Matcher to check how well your resume aligns with your target role's job description before you start applying.`,
  },

  "how-to-negotiate-remote-salary": {
    title: "How to Negotiate a Remote Salary: Global Pay & Geo-Bands Explained",
    category: "Salary",
    date: "June 19, 2026",
    dateISO: "2026-06-19",
    author: "DecaJobs Editorial Team",
    authorRole: "Career Experts at DecaJobs",
    readingTime: "6 min read",
    content: `Remote work has changed salary negotiation. When a company can hire from anywhere, how do they decide what to pay? The answer is usually a geo-band or location-based compensation model. Understanding this — and knowing how to navigate it — can mean a difference of lakhs per year.

**What Is a Geo-Band?**
A geo-band is a salary range tied to the cost of living and market rates of a specific location. A software engineer hired in Bangalore might be paid one range, while the same role hired in London gets another. Many international companies use geo-bands to pay fairly across distributed teams.

**Why Companies Use Geo-Bands**
Geo-bands let companies hire talent anywhere while keeping costs aligned with local markets. They also prevent resentment — a senior engineer in San Francisco is paid more than a peer in Chennai because the cost of living differs dramatically.

**How to Negotiate Within a Geo-Band**
1. Know your band: Ask about the location-based range early in the process
2. Justify the top of the band: Reference your specific skills, experience, and achievements
3. Negotiate beyond base salary: equity, bonuses, home-office stipends, and learning budgets can offset a lower base
4. Ask about currency and review cycles: some companies adjust bands annually

**Key Questions to Ask**
- "Is compensation based on a location-based band, or is it location-agnostic?"
- "What is the salary range for this role in my location?"
- "How often are bands reviewed and adjusted?"
- "Are there additional allowances for home office, internet, or utilities?"

**When Pay Is Location-Agnostic**
Some companies pay the same regardless of location (often at a high global standard). If you're in a lower-cost location, this is a golden opportunity — you earn global rates while spending local. Negotiate confidently; you're not limited by local market rates.

**Negotiating International Remote Roles**
- Research global rates for your role using Levels.fyi and Glassdoor
- Understand taxes and payment structure (contractor vs employee)
- Factor in timezone expectations — overlap requirements can justify higher pay
- Get everything in writing: currency, payment schedule, review cadence

**Red Flags to Watch**
- Refusing to share any salary information
- Vague answers about currency or payment method
- Pressuring you to accept before you see the full offer
- Offering "experience" as payment — that's not a salary

**Pro tip:** Before any remote salary negotiation, benchmark your role with our Salary Calculator. Knowing the remote range for your role and location gives you a data-backed anchor.`,
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
      canonical: `https://decajob.com/blog/${slug}`,
    },
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.content.slice(0, 160),
      type: "article",
      publishedTime: article.dateISO,
      authors: [article.author],
      section: article.category,
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

  // Calculate word count for quality signals
  const wordCount = article.content.split(/\s+/).length;

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: article.title },
          ]}
        />

        <article itemScope itemType="https://schema.org/Article">
          <header>
            <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700 mb-3">
              {article.category}
            </span>
            <h1
              className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Author & date info — critical for E-E-A-T */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Organization">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                  DJ
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900" itemProp="name">{article.author}</p>
                  <p className="text-xs text-neutral-500">{article.authorRole}</p>
                </div>
              </div>
              <span className="text-neutral-300">·</span>
              <time dateTime={article.dateISO} itemProp="datePublished">
                {article.date}
              </time>
              <span className="text-neutral-300">·</span>
              <span>{article.readingTime}</span>
              <span className="text-neutral-300">·</span>
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          </header>

          <div className="mt-8 prose prose-neutral prose-sm sm:prose-base max-w-none" itemProp="articleBody">
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

        {/* Author box — E-E-A-T signal */}
        <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
              DJ
            </div>
            <div>
              <p className="font-semibold text-neutral-900">About {article.author}</p>
              <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                The DecaJobs Editorial Team is a group of career experts, recruiters, and HR
                professionals who create actionable career advice based on real-world hiring data.
                Our articles are reviewed for accuracy and updated regularly to reflect current
                job market trends in India and globally.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-xl bg-primary-50 border border-primary-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-neutral-900">Ready to supercharge your job search?</h3>
          <p className="mt-2 text-sm text-neutral-600">Get 10 AI-matched jobs delivered to your inbox every morning. Free to start.</p>
          <Link href="/login" className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]">
            Start Getting Matched Jobs →
          </Link>
        </div>
      </div>

      {/* Article JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            datePublished: article.dateISO,
            dateModified: article.dateISO,
            author: {
              "@type": "Organization",
              name: article.author,
              url: "https://decajob.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "DecaJobs",
              url: "https://decajob.com",
              logo: {
                "@type": "ImageObject",
                url: "https://decajob.com/web-app-manifest-512x512.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://decajob.com/blog/${slug}`,
            },
            articleSection: article.category,
            wordCount: wordCount,
            inLanguage: "en-US",
          }),
        }}
      />
    </div>
  );
}
