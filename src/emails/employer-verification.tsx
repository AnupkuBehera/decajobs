import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmployerVerificationEmailProps {
  verificationUrl: string;
  companyName?: string;
}

export function EmployerVerificationEmail({
  verificationUrl,
  companyName,
}: EmployerVerificationEmailProps) {
  const previewText = "Verify your employer account on DecaJobs";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandHeader}>
            <Text style={brandName}>DecaJobs</Text>
          </Section>

          <Hr style={divider} />

          <Heading style={heading}>Verify Your Employer Account</Heading>

          <Text style={paragraph}>
            {companyName ? `Hi ${companyName},` : "Hi there,"}
          </Text>

          <Text style={paragraph}>
            Thank you for registering as an employer on DecaJobs. Click the
            button below to verify your email address and start posting jobs.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Your Email
            </Button>
          </Section>

          <Text style={paragraph}>
            Or copy and paste this URL into your browser:
          </Text>
          <Text style={urlFallback}>{verificationUrl}</Text>

          <Text style={expirationNotice}>
            This verification link expires in 24 hours. If the link has expired,
            you can request a new one from the registration page.
          </Text>

          <Hr style={divider} />

          <Text style={footer}>
            If you didn&apos;t create an account on DecaJobs, you can safely
            ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default EmployerVerificationEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const brandHeader = {
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const brandName = {
  color: "#4f46e5",
  fontSize: "20px",
  fontWeight: "700" as const,
  margin: "0",
  textAlign: "center" as const,
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
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
  padding: "14px 32px",
};

const urlFallback = {
  color: "#4f46e5",
  fontSize: "14px",
  lineHeight: "20px",
  wordBreak: "break-all" as const,
  margin: "0 0 16px",
};

const expirationNotice = {
  color: "#92400e",
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
  margin: "0",
  textAlign: "center" as const,
};
