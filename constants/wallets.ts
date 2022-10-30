// Images
import metamaskIcon from "assets/images/mm.png";
import walletConnectIcon from "assets/images/wc.png";
import coinbaseWalletIcon from "assets/images/cbw.png";

interface IIndexable {
  [key: string]: any;
}

const enum Wallets {
  METAMASK = "metamask",
  COINBASE = "coinbasewallet",
  WALLETCONNECT = "walletconnect",
}

export const walletIconMapping: IIndexable = {
  [Wallets.METAMASK]: metamaskIcon,
  [Wallets.COINBASE]: coinbaseWalletIcon,
  [Wallets.WALLETCONNECT]: walletConnectIcon,
};

export const walletLabelMapping: IIndexable = {
  [Wallets.METAMASK]: "Metamask",
  [Wallets.COINBASE]: "Coinbase Wallet",
  [Wallets.WALLETCONNECT]: "Wallet Connect",
};
