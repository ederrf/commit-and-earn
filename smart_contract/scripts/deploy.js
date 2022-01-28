const main = async () => {
  const GitHubPayer = await hre.ethers.getContractFactory("GitHubPayer");
  const gitHubPayer = await GitHubPayer.deploy();

  await gitHubPayer.deployed();

  console.log("GitHubPayer deployed to:", gitHubPayer.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();