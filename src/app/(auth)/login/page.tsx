import type { Metadata } from "next";
import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Sign in to DecaJobs | AI Job Portal",
  description:
    "Sign in to your DecaJobs account to get 10 perfectly matched jobs in your inbox every morning.",
  alternates: {
    canonical: "https://decajob.com/login",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
