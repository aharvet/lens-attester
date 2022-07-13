import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.15',
  networks: {
    hardhat: {
      forking: {
        url: process.env.POLYGON_ENDPOINT || '',
        blockNumber: 30673889,
      },
    },
  },
};

export default config;
