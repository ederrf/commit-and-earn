const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;

    const amount = Math.floor((Math.random())*(5))+1;

    console.log(`Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`);

    await octokit.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: `Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`
    });
}

run().catch(e => core.setFailed(e.message));