const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, '../src/data/contributors.json');

let contributors = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Fetch the last 100 merged PRs
const prsJson = execSync('gh pr list --state merged --limit 100 --json author,number,title,body,additions,deletions,url', { encoding: 'utf8' });
const prs = JSON.parse(prsJson);

// Group PRs by author
const authorPrs = {};
for (const pr of prs) {
    const login = pr.author.login;
    // Skip dependabot or other bots
    if (pr.author.is_bot) continue;
    if (!authorPrs[login]) authorPrs[login] = [];
    authorPrs[login].push(pr);
}

// Ensure unique PRs and count correctly. We will find their best PR.
for (const login in authorPrs) {
    const userPrs = authorPrs[login];
    
    // Find the best PR based on total lines changed (additions + deletions)
    let bestPr = userPrs[0];
    let maxChanges = -1;
    for (const pr of userPrs) {
        const changes = pr.additions + pr.deletions;
        if (changes > maxChanges) {
            maxChanges = changes;
            bestPr = pr;
        }
    }
    
    // Find if user already exists
    let user = contributors.find(c => c.github.endsWith('/' + login));
    
    if (!user) {
        // Fetch missing avatar
        const avatarUrl = execSync(`gh api users/${login} --jq .avatar_url`, { encoding: 'utf8' }).trim();
        user = {
            id: `c_${login}`,
            name: userPrs[0].author.name || login,
            github: `https://github.com/${login}`,
            role: "Contributor",
            bio: "Open source contributor helping build the E-VARA perimeter.",
            avatar: avatarUrl,
            contribution_summary: "Platform Improvements",
            merged_prs: 0,
            featured: false,
            is_founding: false,
            level: "Contributor",
            badges: ["NSOC'26"],
            joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            resolved_issues: []
        };
        contributors.push(user);
    }
    
    // Update their merged PRs count (if we want lifetime we could use a different query, but this works for recent 100)
    // To preserve historical PR count, we take Math.max
    user.merged_prs = Math.max(user.merged_prs || 0, userPrs.length);
    
    // Build a short description
    let cleanBody = bestPr.body ? bestPr.body.replace(/\n|\r/g, ' ').replace(/[^\w\s\.,]/g, '') : '';
    if (cleanBody.length > 80) cleanBody = cleanBody.substring(0, 80) + '...';
    
    // Set their best PR
    user.resolved_issues = [
        {
            issueNumber: bestPr.number,
            title: `🏆 Top Contribution: ${bestPr.title}`,
            description: `Impact Factor: ${bestPr.additions} additions, ${bestPr.deletions} deletions. ${cleanBody ? 'Context: ' + cleanBody : ''}`,
            prLink: bestPr.url
        }
    ];
}

fs.writeFileSync(DATA_FILE, JSON.stringify(contributors, null, 2));
console.log('Contributors data successfully updated with top PRs.');
