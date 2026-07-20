import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Accessibility Statement - DecaJobs",
  description:
    "DecaJobs is committed to digital accessibility. Learn about our WCAG 2.1 AA compliance efforts and how to report accessibility issues.",
  alternates: {
    canonical: "/accessibility",
  },
};

export default function AccessibilityPage() {
  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Accessibility" }]} />

        <div className="prose prose-neutral prose-sm sm:prose-base">
          <h1>Accessibility Statement</h1>
          <p className="text-neutral-500 text-sm">Last updated: July 15, 2026</p>

          <h2>Our Commitment</h2>
          <p>
            DecaJobs is committed to ensuring digital accessibility for all users, including people
            with disabilities. We continuously work to improve the user experience for everyone and
            apply the relevant accessibility standards to make our platform inclusive and usable by
            the widest possible audience.
          </p>

          <h2>Conformance Status</h2>
          <p>
            We strive to conform to the{" "}
            <a
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1
            </a>{" "}
            at Level AA. These guidelines explain how to make web content more
            accessible to people with a wide array of disabilities, including
            visual, auditory, physical, speech, cognitive, language, learning,
            and neurological disabilities.
          </p>

          <h2>Accessibility Features</h2>
          <p>
            DecaJobs incorporates the following accessibility features across our platform:
          </p>

          <h3>Navigation and Structure</h3>
          <ul>
            <li>
              <strong>Skip Navigation Links:</strong> A &quot;Skip to main content&quot; link is
              provided at the top of every page, allowing keyboard users to bypass
              repetitive navigation elements.
            </li>
            <li>
              <strong>Semantic HTML:</strong> We use proper HTML5 semantic elements
              (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
              <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>,{" "}
              <code>&lt;article&gt;</code>) to provide a clear document structure
              for assistive technologies.
            </li>
            <li>
              <strong>Breadcrumb Navigation:</strong> Contextual breadcrumbs are
              provided on content pages to help users understand their location
              within the site hierarchy.
            </li>
            <li>
              <strong>Heading Hierarchy:</strong> Each page uses a single{" "}
              <code>&lt;h1&gt;</code> element with a logical heading hierarchy
              (h2, h3, etc.) to aid navigation by screen readers.
            </li>
          </ul>

          <h3>Visual Design</h3>
          <ul>
            <li>
              <strong>Color Contrast:</strong> We maintain a minimum contrast
              ratio of 4.5:1 for normal text and 3:1 for large text, meeting WCAG
              2.1 AA requirements. Our neutral-500 text color (#6B7280) meets the
              4.5:1 ratio against white backgrounds.
            </li>
            <li>
              <strong>Resizable Text:</strong> All text on the platform can be
              resized up to 200% without loss of content or functionality. We use
              relative units (rem, em) for typography.
            </li>
            <li>
              <strong>Focus Indicators:</strong> All interactive elements display
              a visible focus ring (2px solid outline) when navigated via keyboard,
              ensuring users always know which element is active.
            </li>
            <li>
              <strong>No Color-Only Information:</strong> We do not rely solely on
              color to convey information. Icons, text labels, and patterns are
              used alongside color cues.
            </li>
          </ul>

          <h3>Interactive Elements</h3>
          <ul>
            <li>
              <strong>Minimum Touch Targets:</strong> All buttons and interactive
              elements maintain a minimum height of 44px, complying with the
              recommended touch target size for mobile accessibility.
            </li>
            <li>
              <strong>Form Labels:</strong> All form inputs include associated
              labels and clear error messages to guide users through form
              completion.
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> The entire platform can be
              navigated using only a keyboard. All interactive elements are
              reachable via Tab key, and actions can be triggered with Enter or
              Space.
            </li>
            <li>
              <strong>ARIA Attributes:</strong> We use ARIA (Accessible Rich
              Internet Applications) attributes where native HTML semantics are
              insufficient, such as for dynamic content, modal dialogs, and custom
              components.
            </li>
          </ul>

          <h3>Content</h3>
          <ul>
            <li>
              <strong>Alternative Text:</strong> All meaningful images include
              descriptive alternative text. Decorative images are marked with{" "}
              <code>aria-hidden=&quot;true&quot;</code>.
            </li>
            <li>
              <strong>Language:</strong> The primary language of each page is
              identified using the <code>lang</code> attribute on the{" "}
              <code>&lt;html&gt;</code> element.
            </li>
            <li>
              <strong>Readable Content:</strong> We use clear, concise language
              and avoid jargon where possible. Content is structured with
              headings, lists, and short paragraphs for easy scanning.
            </li>
          </ul>

          <h2>Known Limitations</h2>
          <p>
            While we strive for full WCAG 2.1 AA compliance, some areas may have
            limitations:
          </p>
          <ul>
            <li>
              <strong>Third-Party Content:</strong> Job listings sourced from
              external platforms (LinkedIn, Indeed, Glassdoor, etc.) may not fully
              meet our accessibility standards as we do not control their content
              formatting.
            </li>
            <li>
              <strong>PDF Resumes:</strong> Uploaded PDF resumes are processed by
              our AI tools as text and may not retain their original accessible
              formatting.
            </li>
            <li>
              <strong>AI-Generated Content:</strong> Responses from our AI career
              tools (Career Coach, Cover Letter Generator) are generated
              dynamically and may occasionally produce content that could benefit
              from additional formatting for screen readers.
            </li>
          </ul>

          <h2>Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of DecaJobs. If you
            encounter any accessibility barriers or have suggestions for
            improvement, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:accessibility@decajob.com">
                accessibility@decajob.com
              </a>
            </li>
            <li>
              <strong>General Contact:</strong>{" "}
              <Link href="/contact" className="text-primary-600 hover:underline">
                Contact Form
              </Link>
            </li>
          </ul>
          <p>
            We aim to respond to accessibility feedback within 2 business days
            and will work to resolve any reported issues as quickly as possible.
          </p>

          <h2>Continuous Improvement</h2>
          <p>
            Accessibility is an ongoing effort. We regularly review our platform
            using a combination of automated testing tools (axe-core, Lighthouse)
            and manual evaluation. We are committed to maintaining and improving
            the accessibility of DecaJobs as our platform evolves.
          </p>
        </div>
      </div>
    </div>
  );
}
