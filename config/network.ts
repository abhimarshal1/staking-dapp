import { NetworkConfigType } from "./types";

import interactContractABi from "abis/interactionContract.json";

export const TestNetConfig: NetworkConfigType = {
  chainId: "0x5",
  supportedChainIDs: [5],
  chainName: "Ethereum Goerli Testnet",
  nativeCurrency: {
    name: "ybc",
    symbol: "ybc",
    decimals: 18,
  },
  blockExplorerUrls: ["https://goerli.etherscan.io"],
  contractAddresses: {
    token: "0x0FDeDdA0b61Eb0Bce9B8000FD18331E8bf508338",
    interactionContract: "0xD80b3E1992f8D619E13B82F9a71d706ced9d0874",
  },
  abis: {
    interactionContract: interactContractABi,
  },
};
