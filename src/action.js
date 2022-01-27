const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

    if ( typeof GITHUB_TOKEN !== 'string' ) {
        throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;

    if ( !pull_request ) {
        throw new Error('Could not find pull request!')
    };

    console.log(`Found pull request: ${pull_request.number}`);

    const amount = Math.floor((Math.random())*(5))+1;

    console.log(`Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`);

    await octokit.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: `Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`
    });
}

run().catch(e => core.setFailed(e.message));