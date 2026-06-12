import fs from 'fs';
import path from 'path';

const REPO = 'SHAURYASANYAL3/E-vara';
const CONTRIBUTORS_FILE = path.join(process.cwd(), 'src', 'data', 'contributors.ts');

async function fetchContributors() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'E-VARA-Contributor-Updater'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const res = await fetch(`https://api.github.com/repos/${REPO}/contributors`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function updateContributors() {
  try {
    const apiContributors = await fetchContributors();
    
    // Read the current file content to extract the existing array
    const fileContent = fs.readFileSync(CONTRIBUTORS_FILE, 'utf8');
    
    // Extremely basic regex to find the array content. Since we know the format of contributors.ts:
    const arrayMatch = fileContent.match(/export const contributors: Contributor\[\] = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      throw new Error("Could not parse existing contributors array.");
    }
    
    // Evaluate the array carefully (since it's a TS file with objects, not strict JSON)
    // We use Function constructor as a safer eval for extracting data, but since it's our own static code, it's fine.
    const existingContributors = new Function(`return ${arrayMatch[1]}`)();
    
    const updatedContributors = [];

    // Process each API contributor
    for (const apiUser of apiContributors) {
      if (apiUser.type === 'Bot' || apiUser.login.includes('[bot]')) continue;

      const existingUser = existingContributors.find(c => c.github.endsWith(apiUser.login));
      
      if (existingUser) {
        // Update existing user metrics
        existingUser.merged_prs = apiUser.contributions;
        existingUser.avatar = apiUser.avatar_url;
        updatedContributors.push(existingUser);
      } else {
        // Create new contributor entry
        updatedContributors.push({
          id: `c_${apiUser.id}`,
          name: apiUser.login, // Use username as default name
          github: apiUser.html_url,
          role: "Contributor",
          bio: "Open source contributor helping build the E-VARA perimeter.",
          avatar: apiUser.avatar_url,
          contribution_summary: "Platform Improvements",
          merged_prs: apiUser.contributions,
          featured: false,
          is_founding: false,
          level: "Contributor",
          badges: [],
          joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
      }
    }

    // Preserve any existing users that might not have shown up in the API (e.g. manual entries without GH link matches)
    for (const ex of existingContributors) {
      if (!updatedContributors.find(u => u.id === ex.id)) {
        updatedContributors.push(ex);
      }
    }

    // Generate new file content
    // Convert back to string and ensure we handle quotes properly (since JSON stringifies strings with double quotes)
    const newFileContent = fileContent.replace(
      arrayMatch[0], 
      `export const contributors: Contributor[] = ${JSON.stringify(updatedContributors, null, 2)};`
    );

    fs.writeFileSync(CONTRIBUTORS_FILE, newFileContent, 'utf8');
    console.log(`Successfully updated contributors list with ${updatedContributors.length} users.`);

  } catch (error) {
    console.error("Failed to update contributors:", error);
    process.exit(1);
  }
}

updateContributors();
