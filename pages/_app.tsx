import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";

import { configureChains, chain, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

// Connectors
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.goerli],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_KEY as string,
      priority: 0,
    }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "YBC Staking",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
});

const AppHead = () => (
  <Head>
    <title>YBC Staking</title>
  </Head>
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AppHead />
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
      <ToastContainer position="bottom-left" pauseOnHover theme="dark" />
    </ChakraProvider>
  );
}
