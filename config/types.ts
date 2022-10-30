export interface NetworkConfigType {
  chainId: string;
  supportedChainIDs: number[];
  chainName: string;
  nativeCurrency: {
    name: "ybc";
    symbol: "ybc";
    decimals: 18;
  };
  blockExplorerUrls: string[];
  contractAddresses: {
    token: `0x${string}`;
    interactionContract: `0x${string}`;
  };
  abis: {
    interactionContract: any;
  };
}
