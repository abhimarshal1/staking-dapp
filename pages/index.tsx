import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Center } from "@chakra-ui/react";

// Components
import StakeUnstake from "components/StakeUnstake";
import WalletConnect from "components/WalletConnect";

export default function Home() {
  const { isConnected } = useAccount();
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Center h="100vh" w="100vw" bg="#F0F1F5">
      {isConnected ? <StakeUnstake /> : <WalletConnect />}
    </Center>
  );
}
