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
    if ( typeof PRIVATE_KEY !== 'string' ) {
        throw new Error('Invalid PRIVATE_KEY: did you forget to set it in your action config?');
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;
    const { title } = pull_request;

    if ( !pull_request ) {
        throw new Error('Could not find pull request!')
    };

    const recipient = title;
    const amount = '0.0' + Math.floor(Math.random() * (89) + 10);    
    const parsedAmount = ethers.utils.parseEther(amount);

    const provider = new ethers.providers.JsonRpcProvider(providerAddress);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const gitHubPayer = new ethers.Contract(contractAddress, contractABI, signer);
    const data = await gitHubPayer.transfer(recipient, parsedAmount._hex);

    console.log(data);

    if (data) {
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pull_request.number,
            body: `Thanks for submitting your pull request. We transferred ${amount} (Ropsten) ETH to your account. You can check transaction details at https://ropsten.etherscan.io/tx/${data.hash}`
        });
    } else {
        await octokit.rest.issues.createComment({
            ...context.repo,
            issue_number: pull_request.number,
            body: `Something went wrong while processing your payment. Please contact repo owner.`
        });
    }
}

run().catch(e => core.setFailed(e.message));