Automated Version Control Agent Walkthrough
I have implemented a modular, automated version control agent that watches your project for changes and generates structured commits.

Features
File Watcher: Continuously monitors the project for changes using git status polling.
Change Analyzer: Analyzes file changes to determine context (component, style, test, etc.).
Commit Generator: Generates Conventional Commits based on heuristics.
Git Executor: Automatically stages and commits changes.
Usage
To start the agent, run:

npx tsx scripts/auto-git/index.ts
The agent will run in the background and watch for changes. Press Ctrl+C to stop.

Verification Results
I verified the agent by performing the following actions:

Created a new file 
test-auto-git.txt
.
Result: feat: create test-auto-git.txt
Modified the file.
Result: test: update tests in test-auto-git.txt (detected as test due to filename)
Deleted the file.
Result: chore: delete test-auto-git.txt
Modules
The code is organized in scripts/auto-git/:

index.ts: Entry point.
watcher.ts: Handles file watching.
analyzer.ts: Analyzes changes.
generator.ts: Generates commit messages.
executor.ts: Executes git commands.
types.ts: Type definitions.