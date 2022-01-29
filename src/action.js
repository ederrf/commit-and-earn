const ethers = require('ethers');
const abi = require('./GitHubPayer.json')
const core = require('@actions/core');
const github = require('@actions/github');

const contractAddress = '0xf7e032Fe1aE3aF239dC5Fe847C069B5C17d2F203'
const providerAddress = 'https://eth-ropsten.alchemyapi.io/v2/0Q_BZcmxqVdAJiZtE6srU6jF4oY-XzJ6'
const contractABI = abi.abi; 

const run = async () => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const PRIVATE_KEY = core.getInput('PRIVATE_KEY');

    if ( typeof GITHUB_TOKEN !== 'string' ) {
        throw new Error('Invalid GITHUB_TOKEN: did you forget to set it in your action config?');
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;
    const { number, title } = pull_request;

    const amount = title.split('|')[1];
    const title = title.split('|')[0];
    
    if ( !pull_request ) {
        throw new Error('Could not find pull request!')
    };

    console.log(`Found pull request number: ${number} titled: ${title}`);

    // const amount = (Math.floor((Math.random())*(5))+1);
    
    const parsedAmount = ethers.utils.parseEther(amount);
    console.log(`Parsed amount ${parsedAmount}`)

    console.log(`Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`);

    const provider = new ethers.providers.JsonRpcProvider(providerAddress);

    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    const gitHubPayer = new ethers.Contract(contractAddress, contractABI, signer);
    
    const data = await gitHubPayer.transfer(title,parsedAmount._hex);

    console.log(data);

    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: `Thanks for submitting your pull request. If merged this will reward you with ${amount} (fake) ETH`
    });
}

run().catch(e => core.setFailed(e.message));