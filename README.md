# Bulk GitHub Action Runner

This project automates the execution of multiple GitHub Actions workflows across various projects and branches using [Puppeteer](https://pptr.dev/), enabling streamlined workflow management from the command line.

## Repository

Find the source code in the [bulk-github-action-runner](https://github.com/BirajMainali/bulk-github-action-runner) repository.

## Features

- Initiates workflows for specific branches (`develop` or `master`) as configured.
- Automates GitHub Actions for multiple projects within an organization.
- Configurable with `config.json` for project details, workflows, branches, and browser settings.
- Launches a Chrome/Chromium instance for browser-based UI automation.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- [Puppeteer](https://pptr.dev/)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/BirajMainali/bulk-github-action-runner.git
   cd bulk-github-action-runner
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure `config.json`**:
   Create a `config.json` file in the root directory using the following structure:

   ```json
   {
       "browser": {
           "executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
           "userDataDir": "C:\\Users\\{{Your Name}}\\AppData\\Local\\Google\\Chrome\\User Data"
       },
       "supportedBranches": ["develop", "master"],
       "organization": "organization-name",
       "projects": [
           {
               "name": "project-name",
               "workflows": {
                   "develop": ["build-dev", "deploy-dev"],
                   "master": ["deploy.yml"]
               }
           }
       ]
   }
   ```

   - **`browser.executablePath`**: Path to your Chrome/Chromium executable.
   - **`browser.userDataDir`**: Path to your Chrome user data directory (to retain login sessions).
   - **`supportedBranches`**: List of branches where workflows can run (e.g., `develop`, `master`).
   - **`organization`**: Your GitHub organization or username.
   - **`projects`**: Array of projects with workflow file names specific to each branch.

## Usage

Run the script using the following command:

```bash
node index.js
```

The script will prompt you to select a branch (`develop` or `master`) to run workflows. Based on your selection, it will:

1. Navigate to each project’s GitHub Actions page.
2. Select the specified branch.
3. Start the workflows listed for that branch.

### Example Config Prompt
```plaintext
Which branch do you want to run the workflow for (develop/master)?
```

## Script Structure

The script includes the following key functions:

- **`loadConfig()`**: Reads and parses `config.json`.
- **`promptUserForBranch()`**: Prompts user to select a branch.
- **`extractProjectWorkflows()`**: Retrieves workflows specific to the selected branch.
- **`constructWorkflowUrl()`**: Builds the URL for each workflow on GitHub.
- **`generateSubmitSelector()`**: Builds the selector to locate the workflow submission button.
- **`openPageWithUrl()`**: Opens a new page and navigates to the specified URL.
- **`initiateWorkflowAction()`**: Clicks the button to start the workflow.
- **`revealBranchSelection()`**: Opens the branch selection dropdown.
- **`selectBranch()`**: Types and selects the specified branch.
- **`executeWorkflow()`**: Submits the workflow for execution.

## Notes

- Ensure you are logged into GitHub in Chrome/Chromium for Puppeteer to work seamlessly.
- If your account has two-factor authentication, you may need to log in manually during the first run.
- The `userDataDir` path retains login data, reducing the need to re-authenticate.

## License

This project is open-source and available under the MIT License.
