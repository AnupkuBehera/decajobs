import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface DigestJob {
  title: string;
  description: string;
  location: string;
  applicationLink: string;
}

interface DailyDigestEmailProps {
  jobs: DigestJob[];
  date?: string;
  unsubscribeUrl: string;
  preferencesUrl?: string;
}

export function DailyDigestEmail({
  jobs,
  date,
  unsubscribeUrl,
  preferencesUrl,
}: DailyDigestEmailProps) {
  const formattedDate =
    date ?? new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const previewText = `Your DecaJobs Daily 10 for ${formattedDate}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Your DecaJobs Daily 10</Heading>
            <Text style={headerDate}>{formattedDate}</Text>
          </Section>

          <Hr style={divider} />

          {/* Job Cards */}
          {jobs.map((job, index) => (
            <Section key={index} style={jobCard}>
              <Link href={job.applicationLink} style={jobTitleLink}>
                {job.title}
              </Link>
              <Text style={locationBadge}>{job.location}</Text>
              <Text style={jobDescription}>
                {job.description.length > 150
                  ? `${job.description.slice(0, 150)}…`
                  : job.description}
              </Text>
              <Button href={job.applicationLink} style={applyButton}>
                Apply Now
              </Button>
              {index < jobs.length - 1 && <Hr style={jobDivider} />}
            </Section>
          ))}

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you signed up for DecaJobs
              daily digest.
            </Text>
            <Text style={footerLinks}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
              {preferencesUrl && (
                <>
                  {" · "}
                  <Link href={preferencesUrl} style={footerLink}>
                    Email Preferences
                  </Link>
                </>
              )}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default DailyDigestEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
};

const header = {
  backgroundColor: "#2563eb",
  padding: "32px 24px",
  borderRadius: "8px 8px 0 0",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700" as const,
  margin: "0 0 8px",
};

const headerDate = {
  color: "#bfdbfe",
  fontSize: "14px",
  margin: "0",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const jobCard = {
  padding: "24px",
};

const jobTitleLink = {
  color: "#2563eb",
  fontSize: "18px",
  fontWeight: "600" as const,
  textDecoration: "none",
  display: "block" as const,
  marginBottom: "8px",
};

const locationBadge = {
  display: "inline-block" as const,
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "500" as const,
  padding: "4px 10px",
  borderRadius: "12px",
  margin: "0 0 12px",
};

const jobDescription = {
  color: "#4b5563",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 16px",
};

const applyButton = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block" as const,
  padding: "10px 20px",
};

const jobDivider = {
  borderColor: "#f3f4f6",
  margin: "24px 0 0",
};

const footer = {
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const footerLinks = {
  margin: "0",
};

const footerLink = {
  color: "#6b7280",
  fontSize: "12px",
  textDecoration: "underline",
};
