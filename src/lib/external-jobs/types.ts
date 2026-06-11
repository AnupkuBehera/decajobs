/**
 * Common type for jobs fetched from external APIs.
 */
export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applicationLink: string;
  postedAt: string;
  source: string;
}
