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

// Current Sprint Contributors
export const contributors: Contributor[] = [
  {
    "id": "c_001",
    "name": "Shaurya Sanyal",
    "github": "https://github.com/SHAURYASANYAL3",
    "role": "Lead Architect & Founder",
    "bio": "Building the zero-trust identity perimeter. Focuses on core infrastructure, Edge Functions, and threat engine architecture.",
    "avatar": "https://avatars.githubusercontent.com/u/128920982?v=4",
    "contribution_summary": "Core Platform Architecture, Zero-Trust Engine",
    "merged_prs": 161,
    "featured": true,
    "is_founding": true,
    "level": "Founding Contributor",
    "badges": [
      "Backend",
      "Security",
      "Product",
      "NSOC'26"
    ],
    "joinedAt": "Jan 2024",
    "resolved_issues": [
      {
        "issueNumber": 14,
        "title": "Implement Zero-Trust Threat Engine",
        "description": "Built the core pipeline to ingest and normalize external threat feeds in real-time.",
        "prLink": "https://github.com/SHAURYASANYAL3/E-vara/pull/14"
      },
      {
        "issueNumber": 21,
        "title": "Add Automated DMCA Generation",
        "description": "Engineered a JS-based PDF generation pipeline for 1-click legal takedown notices.",
        "prLink": "https://github.com/SHAURYASANYAL3/E-vara/pull/21"
      }
    ]
  },
  {
    "id": "c_002",
    "name": "mdhanvantar-web",
    "github": "https://github.com/mdhanvantar-web",
    "role": "Core Contributor",
    "bio": "Driving the frontend UI/UX architecture and designing the threat visualization dashboard.",
    "avatar": "https://avatars.githubusercontent.com/u/263683833?v=4",
    "contribution_summary": "Frontend Architecture, UI/UX Implementation",
    "merged_prs": 49,
    "featured": true,
    "is_founding": true,
    "level": "Core Contributor",
    "badges": [
      "Frontend",
      "Design",
      "NSOC'26"
    ],
    "joinedAt": "Feb 2024",
    "resolved_issues": [
      {
        "issueNumber": 8,
        "title": "Design Concierge Dashboard UI",
        "description": "Created the sleek, high-end dark mode UI for the Concierge Threat Dashboard.",
        "prLink": "https://github.com/SHAURYASANYAL3/E-vara/pull/8"
      },
      {
        "issueNumber": 11,
        "title": "Implement Lazy Loading & SEO Schema",
        "description": "Optimized React Suspense boundaries and injected JSON-LD schema for AI ranking.",
        "prLink": "https://github.com/SHAURYASANYAL3/E-vara/pull/11"
      }
    ]
  },
  {
    "id": "c_193049402",
    "name": "jhnavi25",
    "github": "https://github.com/jhnavi25",
    "role": "Contributor",
    "bio": "Open source contributor helping build the E-VARA perimeter.",
    "avatar": "https://avatars.githubusercontent.com/u/193049402?v=4",
    "contribution_summary": "Platform Improvements",
    "merged_prs": 10,
    "featured": false,
    "is_founding": false,
    "level": "Contributor",
    "badges": [],
    "joinedAt": "Jun 2026"
  },
  {
    "id": "c_184750994",
    "name": "diksha78dev",
    "github": "https://github.com/diksha78dev",
    "role": "Contributor",
    "bio": "Open source contributor helping build the E-VARA perimeter.",
    "avatar": "https://avatars.githubusercontent.com/u/184750994?v=4",
    "contribution_summary": "Platform Improvements",
    "merged_prs": 2,
    "featured": false,
    "is_founding": false,
    "level": "Contributor",
    "badges": [],
    "joinedAt": "Jun 2026"
  },
  {
    "id": "c_210362211",
    "name": "SriyaMeenakshi",
    "github": "https://github.com/SriyaMeenakshi",
    "role": "Contributor",
    "bio": "Open source contributor helping build the E-VARA perimeter.",
    "avatar": "https://avatars.githubusercontent.com/u/210362211?v=4",
    "contribution_summary": "Platform Improvements",
    "merged_prs": 2,
    "featured": false,
    "is_founding": false,
    "level": "Contributor",
    "badges": [],
    "joinedAt": "Jun 2026"
  }
];
