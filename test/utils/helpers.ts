import { network, ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export const getImpersonatedSigner = async (
  account: string,
): Promise<SignerWithAddress> => {
  await network.provider.request({
    method: 'hardhat_impersonateAccount',
    params: [account],
  });
  return await ethers.getSigner(account);
};
