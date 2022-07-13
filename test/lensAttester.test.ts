import { expect } from 'chai';
import { network, ethers } from 'hardhat';
import { LensAttester } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getImpersonatedSigner } from './utils/helpers';
import {
  erc1155BalanceOfAbi,
  attestationsRegistryAuthorizeRangeAbi,
} from './utils/abi';
import {
  attestationsRegistryAddress,
  lensHubAddress,
  attestationsRegistryOwnerAddress,
  badgesAddress,
  lensProfilOwnerAddress,
} from './utils/address';

describe('LensAttester', () => {
  const groupId = 0;

  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let attestationsRegistryOwner: SignerWithAddress;
  let lensProfilOwner: SignerWithAddress;
  let attester: LensAttester;

  beforeEach(async () => {
    // Get fresh accounts
    [deployer, user] = await ethers.getSigners();

    // Impersonate existing accounts
    attestationsRegistryOwner = await getImpersonatedSigner(
      attestationsRegistryOwnerAddress,
    );
    lensProfilOwner = await getImpersonatedSigner(lensProfilOwnerAddress);

    // Give some MATIC to attestations registry owner
    await network.provider.send('hardhat_setBalance', [
      attestationsRegistryOwnerAddress,
      '0x56Bbc75e2d63100000', // 100
    ]);

    // Deploy our Lens attester
    const LensAttester = await ethers.getContractFactory('LensAttester');
    attester = await LensAttester.deploy(
      attestationsRegistryAddress,
      lensHubAddress,
      groupId,
      groupId,
    );

    // Authorize our attester to record attestations
    const attestationsRegistry = await ethers.getContractAt(
      attestationsRegistryAuthorizeRangeAbi,
      attestationsRegistryAddress,
    );
    await attestationsRegistry
      .connect(attestationsRegistryOwner)
      .authorizeRange(attester.address, 0, 0);
  });

  describe('generateAttestations', () => {
    const claims = [{ groupId: 0, claimedValue: 1, extraData: '0x' }];

    it('Should register attestation', async () => {
      const request = {
        claims,
        destination: user.address,
      };

      await attester
        .connect(lensProfilOwner)
        .generateAttestations(request, '0x');

      // Check if the badge is available
      const badges = await ethers.getContractAt(
        erc1155BalanceOfAbi,
        badgesAddress,
      );
      expect(await badges.balanceOf(user.address, 0)).equal(1);
    });

    it('Should not register attestation', async () => {
      const request = {
        claims,
        destination: user.address,
      };

      // User address doesn't have any Lens profil NFT
      await expect(attester.connect(user).generateAttestations(request, '0x'))
        .to.be.reverted;
    });
  });
});
