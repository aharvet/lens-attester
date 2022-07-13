// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import {Attester} from './Attester.sol';
import {Claim, Request, Attestation} from './libs/Structs.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';


contract LensAttester is Attester {
    address public immutable LENS_HUB;
    uint256 public immutable AUTHORIZED_COLLECTION_ID_FIRST;
    uint256 public immutable AUTHORIZED_COLLECTION_ID_LAST;

    error ClaimValueInvalid(uint256 actualBalance, uint256 claimedBalance);

    constructor (
        address attestationsRegistryAddress,
        address lensHub,
        uint256 collectionIdFirst,
        uint256 collectionIdLast
    )
        Attester(attestationsRegistryAddress)
    {
        LENS_HUB = lensHub;
        AUTHORIZED_COLLECTION_ID_FIRST = collectionIdFirst;
        AUTHORIZED_COLLECTION_ID_LAST = collectionIdLast;
    }

    function _verifyRequest(Request calldata request, bytes calldata) internal view override {
        Claim memory claim = request.claims[0];
        uint256 tokenBalance = IERC721(LENS_HUB).balanceOf(msg.sender);
        if (tokenBalance < 1) revert ClaimValueInvalid(tokenBalance, claim.claimedValue);
    }

    function buildAttestations(Request calldata request, bytes calldata)
    public
    view
    override
    returns (Attestation[] memory) {
        Attestation[] memory attestations = new Attestation[](1);

        Claim memory claim = request.claims[0];

        uint256 attestationCollectionId = AUTHORIZED_COLLECTION_ID_FIRST;
        address issuer = address(this);

        attestations[0] = Attestation(
        attestationCollectionId,
        request.destination,
        issuer,
        claim.claimedValue,
        uint32(block.timestamp),
        ''
        );

        return (attestations);
    }
}
