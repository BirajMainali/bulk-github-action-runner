const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');

const loadConfig = () => JSON.parse(fs.readFileSync('./config.json', 'utf8'));

const promptUserForBranch = () => {

    const { supportedBranches } = loadConfig();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`Which branch do you want to run the workflow for (${supportedBranches})? `, (branch) => {
            rl.close();
            resolve(branch);
        });
    });
};

const extractProjectWorkflows = ({ branch, project }) => {
    console.log(`Extracting workflows for ${project.name} on branch ${branch}`);
    return {
        name: project.name,
        workflows: project.workflows[branch]
    };
};

const constructWorkflowUrl = ({ organization, projectName, workflow }) =>
    `https://github.com/${organization}/${projectName}/actions/workflows/${workflow}`;

const generateSubmitSelector = ({ organization, projectName }) => {
    console.log(`Generating submit button selector for ${organization}/${projectName}`);
    const formAction = `/${organization}/${projectName}/actions/manual`;
    return {
        submitSelector: `form[action="${formAction}"][method="POST"] button[type="submit"]`,
        formAction
    };
};

const executeWorkflow = async ({ page, submitSelector, branch }) => {
    console.log('Executing workflow');
    await page.waitForSelector(`input#branch[value='${branch}']`);
    await page.evaluate(`window.document.querySelector('${submitSelector}').click()`);
};

const selectBranch = async (page, branch) => {
    console.log('Selecting branch');
    await page.keyboard.type(branch);
    await page.keyboard.press("Enter");
};

const revealBranchSelection = async (page) => {
    console.log('Revealing branch selection');
    await page.waitForSelector('.branch-selection summary');
    await page.click('.branch-selection summary');
};

const initiateWorkflowAction = async (page) => {
    console.log('Initiating workflow action');
    await page.waitForSelector('.flash-action summary');
    await page.click('.flash-action summary');
};

const openPageWithUrl = async (browser, url) => {
    console.log(`Opening URL: ${url}`);
    const page = await browser.newPage();
    await page.goto(url);
    return page;
};

(async () => {
    const config = loadConfig();
    const branch = await promptUserForBranch();

    const { organization, projects, browser: browserSettings } = config;

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: browserSettings.executablePath,
        userDataDir: browserSettings.userDataDir,
        args: ['--start-maximized'],
        ignoreDefaultArgs: ['--disable-extensions']
    });

    for (const project of projects) {

        const { name: projectName, workflows } = extractProjectWorkflows({ branch, project });

        for (const workflow of workflows) {

            const url = constructWorkflowUrl({ organization, projectName, workflow });
            const { submitSelector } = generateSubmitSelector({ organization, projectName });

            const page = await openPageWithUrl(browser, url);
            await initiateWorkflowAction(page);
            await revealBranchSelection(page);
            await selectBranch(page, branch);
            await executeWorkflow({ page: page, submitSelector: submitSelector, branch: branch });
            await page.waitForNavigation();
            await page.close();
        }
    }

    await browser.close();
})();
