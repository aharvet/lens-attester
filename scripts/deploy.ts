import { ethers } from 'hardhat';

import {
  attestationsRegistryAddress,
  lensHubAddress,
} from '../test/utils/address';

async function main() {
  const groupId = 0;

  const LensAttester = await ethers.getContractFactory('LensAttester');
  const lensAttester = await LensAttester.deploy(
    attestationsRegistryAddress,
    lensHubAddress,
    groupId,
    groupId,
  );

  await lensAttester.deployed();

  console.log('LensAttester deployed to:', lensAttester.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
