export type ContributionLevel =
  | "Explorer"
  | "Contributor"
  | "Core Contributor"
  | "Maintainer"
  | "Founding Contributor";
export type BadgeType =
  | "Frontend"
  | "Backend"
  | "Security"
  | "Design"
  | "Research"
  | "Product"
  | "NSOC'26";

export interface ResolvedIssue {
  issueNumber: number;
  title: string;
  description: string;
  prLink?: string;
}

export interface Contributor {
  id: string;
  name: string;
  github: string;
  role: string;
  bio: string;
  avatar: string;
  contribution_summary: string;
  merged_prs: number;
  featured: boolean;
  is_founding: boolean;
  level: ContributionLevel;
  badges: BadgeType[];
  joinedAt: string;
  resolved_issues?: ResolvedIssue[];
}

import contributorsData from './contributors.json';
export const contributors: Contributor[] = contributorsData as Contributor[];
