import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface MagicLinkEmailProps {
  loginUrl: string;
}

export function MagicLinkEmail({ loginUrl }: MagicLinkEmailProps) {
  const previewText = "Log in to DecaJobs";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>DecaJobs</Heading>

          <Text style={paragraph}>Hi there,</Text>

          <Text style={paragraph}>
            Click the button below to log in to your DecaJobs account. No
            password needed.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Log in to DecaJobs
            </Button>
          </Section>

          <Text style={paragraph}>
            Or copy and paste this URL into your browser:
          </Text>
          <Link href={loginUrl} style={link}>
            {loginUrl}
          </Link>

          <Text style={expirationNotice}>
            This link expires in 15 minutes. If the link has expired, you can
            request a new one from the login page.
          </Text>

          <Text style={footer}>
            If you didn&apos;t request this login link, you can safely ignore
            this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#1a1a2e",
  fontSize: "24px",
  fontWeight: "700" as const,
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const paragraph = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const link = {
  color: "#4f46e5",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};

const expirationNotice = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "24px 0 16px",
  padding: "12px 16px",
  backgroundColor: "#fef3cd",
  borderRadius: "6px",
  border: "1px solid #fde68a",
};

const footer = {
  color: "#9ca3af",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};
