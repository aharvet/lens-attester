# Lens Attester

This is a smart contract project that implements a simple Sismo attester that checks if an address has a Lens profile.

## Contract

The main contract is located at `contracts/LensAttester.sol`.

## Tests

The test suit is located at `test/lensAttester.test.ts`.

It contains the multiple steps to authorize the attester to record an attestation in the registry.

1. Create an env file

```
cp .env.example .env
```

2. Fill the required field

3. Run the test suit

```
npm test
```
