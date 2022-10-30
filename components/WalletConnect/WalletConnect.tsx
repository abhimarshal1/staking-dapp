import { Box, Button, Center, Text, useDisclosure } from "@chakra-ui/react";
import WalletConnectModal from "./components/WalletConnectModal";

const WalletConnect = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg="white"
      borderRadius={8}
      minW={{ base: "fit-content", md: 350 }}
      minH={400}
    >
      <Text p={8} bg="black" color="white" borderTopRadius={8}>
        Welcome to test app
      </Text>
      <Center h="100%" padding={8} flexDir="column">
        <Text>To get started, connect your wallet</Text>
        <Button onClick={onOpen} mt={8}>
          Connect your wallet
        </Button>
        <WalletConnectModal isOpen={isOpen} onClose={onClose} />
      </Center>
    </Box>
  );
};

export default WalletConnect;
