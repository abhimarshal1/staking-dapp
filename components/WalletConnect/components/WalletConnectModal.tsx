import { useRef, useState } from "react";
import Image from "next/image";
import { Connector, useConnect } from "wagmi";
import {
  Button,
  ButtonSpinner,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Id, toast } from "react-toastify";

// Contants
import { walletIconMapping, walletLabelMapping } from "constants/wallets";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const WalletConnectModal = ({ isOpen, onClose }: Props) => {
  const toastId = useRef<Id>("");

  const [connectorPref, setConnectionPref] = useState("");

  const { connect, connectors } = useConnect({
    onSuccess() {
      toast.update(toastId.current, {
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        render: "Wallet connection successful",
        autoClose: 5000,
      });
      onClose();
    },
    onError(error) {
      toast.update(toastId.current, {
        type: toast.TYPE.ERROR,
        isLoading: false,
        render: error.message.slice(
          0,
          error.message.length > 60 ? 60 : error.message.length - 1
        ),
        autoClose: 5000,
      });
    },
    onSettled() {
      setConnectionPref("");
    },
  });

  const handleConnect = (id: string, connector: Connector) => {
    toastId.current = toast.loading("Check wallet for prompt", {
      autoClose: false,
    });

    setConnectionPref(id);
    connect({ connector });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={8}>
        <ModalHeader
          fontWeight="normal"
          fontSize={16}
          bg="black"
          color="white"
          borderTopRadius={8}
        >
          Select Wallet
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody py={6}>
          <Flex flexDir="column" gap="1rem">
            {connectors.map((connector) => (
              <Button
                onClick={() =>
                  handleConnect(connector.id.toLowerCase(), connector)
                }
                h="52px"
                fontWeight="normal"
                fontSize={14}
                disabled={!!connectorPref}
              >
                {connectorPref === connector.id.toLowerCase() ? (
                  <ButtonSpinner />
                ) : (
                  <>
                    <Image
                      src={walletIconMapping[connector.id.toLowerCase()]}
                      alt={`${connector.id.toLowerCase()}-icon`}
                      height={20}
                      width={20}
                    />
                    <Text ml={2}>
                      {walletLabelMapping[connector.id.toLowerCase()]}
                    </Text>
                  </>
                )}
              </Button>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WalletConnectModal;
