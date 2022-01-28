const ethers = require('ethers');
const abi = require('./GitHubPayer.json')
const core = require('@actions/core');
const github = require('@actions/github');

const contractAddress = '0xaf0c0dDe0a6906c4372cf965FcF9836817179F37';
const providerAddress = 'https://eth-ropsten.alchemyapi.io/v2/0Q_BZcmxqVdAJiZtE6srU6jF4oY-XzJ6'
const contractABI = abi.abi; 

const run = async () => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

    if ( typeof GITHUB_TOKEN !== 'string' ) {
        throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;
    const { number, title } = pull_request;

    if ( !pull_request ) {
        throw new Error('Could not find pull request!')
    };

    console.log(`Found pull request number: ${number} titled: ${title}`);

    const amount = Math.floor((Math.random())*(0))+1;

    console.log(`Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`);

    const provider = new ethers.providers.JsonRpcProvider(providerAddress);

    const gitHubPayer = new ethers.Contract(contractAddress, contractABI, provider.getSigner(contractAddress));
    const data = await gitHubPayer.transfer(title,amount);

    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: `Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`
    });
}

run().catch(e => core.setFailed(e.message));