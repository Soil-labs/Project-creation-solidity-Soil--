// deploy/00_deploy_contract

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args = ['0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199','Test Project', 'Test ProjectDesc', ['member']];
  await deploy('Project', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    args: args,
    from: deployer,
    log: true,
  });
};
module.exports.tags = ['all', 'project'];
