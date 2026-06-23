"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const SALARY_DATA: Record<string, Record<string, { min: number; mid: number; max: number }>> = {
  "Software Engineer": { "Bangalore": { min: 600000, mid: 1200000, max: 2500000 }, "Mumbai": { min: 550000, mid: 1100000, max: 2200000 }, "Delhi": { min: 500000, mid: 1000000, max: 2000000 }, "Hyderabad": { min: 550000, mid: 1100000, max: 2200000 }, "Remote": { min: 800000, mid: 1500000, max: 3500000 }, "USA": { min: 5500000, mid: 9000000, max: 15000000 } },
  "Data Analyst": { "Bangalore": { min: 400000, mid: 800000, max: 1600000 }, "Mumbai": { min: 380000, mid: 750000, max: 1500000 }, "Delhi": { min: 350000, mid: 700000, max: 1400000 }, "Hyderabad": { min: 380000, mid: 750000, max: 1500000 }, "Remote": { min: 500000, mid: 1000000, max: 2000000 }, "USA": { min: 4500000, mid: 7000000, max: 12000000 } },
  "Product Manager": { "Bangalore": { min: 1200000, mid: 2200000, max: 4000000 }, "Mumbai": { min: 1100000, mid: 2000000, max: 3800000 }, "Delhi": { min: 1000000, mid: 1800000, max: 3500000 }, "Hyderabad": { min: 1000000, mid: 1800000, max: 3500000 }, "Remote": { min: 1500000, mid: 2800000, max: 5000000 }, "USA": { min: 8000000, mid: 12000000, max: 20000000 } },
  "DevOps Engineer": { "Bangalore": { min: 800000, mid: 1500000, max: 3000000 }, "Mumbai": { min: 750000, mid: 1400000, max: 2800000 }, "Delhi": { min: 700000, mid: 1300000, max: 2500000 }, "Hyderabad": { min: 700000, mid: 1300000, max: 2500000 }, "Remote": { min: 1000000, mid: 2000000, max: 4000000 }, "USA": { min: 7000000, mid: 11000000, max: 17000000 } },
  "UI/UX Designer": { "Bangalore": { min: 500000, mid: 1000000, max: 2000000 }, "Mumbai": { min: 450000, mid: 900000, max: 1800000 }, "Delhi": { min: 400000, mid: 800000, max: 1600000 }, "Hyderabad": { min: 400000, mid: 800000, max: 1600000 }, "Remote": { min: 600000, mid: 1200000, max: 2500000 }, "USA": { min: 5000000, mid: 8000000, max: 13000000 } },
  "Frontend Developer": { "Bangalore": { min: 500000, mid: 1000000, max: 2200000 }, "Mumbai": { min: 450000, mid: 950000, max: 2000000 }, "Delhi": { min: 400000, mid: 900000, max: 1800000 }, "Hyderabad": { min: 450000, mid: 950000, max: 2000000 }, "Remote": { min: 700000, mid: 1400000, max: 3000000 }, "USA": { min: 5000000, mid: 8500000, max: 14000000 } },
  "Backend Developer": { "Bangalore": { min: 600000, mid: 1200000, max: 2500000 }, "Mumbai": { min: 550000, mid: 1100000, max: 2300000 }, "Delhi": { min: 500000, mid: 1000000, max: 2000000 }, "Hyderabad": { min: 550000, mid: 1100000, max: 2300000 }, "Remote": { min: 800000, mid: 1600000, max: 3500000 }, "USA": { min: 6000000, mid: 9500000, max: 15000000 } },
  "Machine Learning Engineer": { "Bangalore": { min: 1000000, mid: 2000000, max: 4000000 }, "Mumbai": { min: 900000, mid: 1800000, max: 3500000 }, "Delhi": { min: 800000, mid: 1600000, max: 3200000 }, "Hyderabad": { min: 900000, mid: 1800000, max: 3500000 }, "Remote": { min: 1500000, mid: 3000000, max: 6000000 }, "USA": { min: 9000000, mid: 14000000, max: 22000000 } },
};

const roles = Object.keys(SALARY_DATA);
const locations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Remote", "USA"];

function formatSalary(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} LPA`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function SalaryCalculatorPage() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const salaryData = role && location ? SALARY_DATA[role]?.[location] : null;

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Salary Calculator
          </h1>
          <p className="mt-3 text-neutral-600">
            Compare salaries by role and location. Data based on 2025-2026 market rates.
          </p>
        </div>

        <Card padding="lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              >
                <option value="">Select a role...</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
              >
                <option value="">Select location...</option>
                {locations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {salaryData && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                {role} in {location}
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-500 mb-1">Entry Level</p>
                  <p className="text-lg font-bold text-neutral-900">{formatSalary(salaryData.min)}</p>
                </div>
                <div className="rounded-lg bg-primary-50 p-4 border border-primary-200">
                  <p className="text-xs text-primary-600 mb-1">Mid Level</p>
                  <p className="text-lg font-bold text-primary-700">{formatSalary(salaryData.mid)}</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-4">
                  <p className="text-xs text-neutral-500 mb-1">Senior Level</p>
                  <p className="text-lg font-bold text-neutral-900">{formatSalary(salaryData.max)}</p>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-6">
                <div className="h-3 rounded-full bg-gradient-to-r from-yellow-400 via-green-500 to-blue-600 relative">
                  <div className="absolute -top-6 left-0 text-xs text-neutral-500">{formatSalary(salaryData.min)}</div>
                  <div className="absolute -top-6 right-0 text-xs text-neutral-500">{formatSalary(salaryData.max)}</div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">Want jobs that match your salary expectations?</p>
          <Link href="/login" className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 hover:underline">
            Sign up for DecaJobs — get salary-matched jobs daily →
          </Link>
        </div>
      </div>
    </div>
  );
}
