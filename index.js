const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');

const loadConfig = () => {
    return JSON.parse(fs.readFileSync('./config.json', 'utf8'));
};

const askUserForBranch = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`Which branch do you want to run the workflow for (develop/master)? `, (branch) => {
            rl.close();
            resolve(branch);
        });
    });
};

(async () => {

    const config = loadConfig();
    const branch = await askUserForBranch();
    const { organization, projects } = config;

    for (let i = 0; i < projects.length; i++) {

        const project = projects[i];
        const projectName = project.name;
        console.log(`Running workflow for ${projectName}...\n`);
        const workflows = project.workflows[branch];
        console.log("Workflows: ", workflows);

        for (let j = 0; j < workflows.length; j++) {
            const workflow = workflows[j];
            const url = `https://github.com/${organization}/${projectName}/actions/workflows/${workflow}`;

            console.log(`Opening ${url} in browser...\n`);

            const browser = await puppeteer.launch({
                headless: false,
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                userDataDir: 'C:\\Users\\Biraj Mainali\\AppData\\Local\\Google\\Chrome\\User Data',
                args: ['--start-maximized']
            });

            const page = await browser.newPage();
            await page.goto(url);
            console.log(`Running workflow ${workflow} for ${projectName}...\n`);
            await page.waitForSelector('.flash-action summary');
            await page.click('.flash-action summary');

            await page.waitForSelector('.branch-selection summary');
            await page.click('.branch-selection summary');

            await page.keyboard.type(branch);
            await page.keyboard.press("Enter");

            await page.locator("/html/body/div[1]/div[5]/div/main/turbo-frame/div/split-page-layout/div/div/div[2]/div/div/div[2]/div[2]/details/div/div/div/form[2]/button").click();
        }
    }
})();
