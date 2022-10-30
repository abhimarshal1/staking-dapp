import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  ButtonSpinner,
  Flex,
  FlexProps,
  Text,
  Link,
} from "@chakra-ui/react";
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useWaitForTransaction,
} from "wagmi";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { Id, toast } from "react-toastify";

// Config
import config from "config";

// Constants
import { txnType } from "../constants";

// Components
import Button from "components/Button";

interface Props extends FlexProps {
  amount: string;
  balance: string;
  limit: string;
}

export const APPROVAL_AMOUNT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

const Actions = ({ amount, balance, limit, ...rest }: Props) => {
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
    onSuccess() {
      toastId.current = toast.success(`Network switch successful`);
    },
    onError(error) {
      toastId.current = toast.error(`Error switching network :${error}`);
    },
  });
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const toastId = useRef<Id>("");

  const [action, setAction] = useState("");
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");

  const initiateTxn = useCallback(
    () =>
      (toastId.current = toast.loading("Check wallet for prompt", {
        autoClose: false,
      })),
    [toastId.current]
  );

  const setTxnInProgress = useCallback(
    (hash: string) =>
      toast.update(toastId.current, {
        render: (
          <Box>
            <Text>Transaction in progress</Text>
            <Link
              href={`${config.blockExplorerUrls[0]}/tx/${hash}`}
              target="_blank"
              color="#47B5FF"
              mt="0.5rem"
              fontSize={14}
            >
              View in Explorer
            </Link>
          </Box>
        ),
      }),
    [toastId.current]
  );

  const setTxnError = useCallback(
    (error: Error) =>
      toast.update(toastId.current, {
        type: toast.TYPE.ERROR,
        isLoading: false,
        render: error.message.slice(
          0,
          error.message.length > 60 ? 60 : error.message.length - 1
        ),
        autoClose: 5000,
      }),
    [toastId.current]
  );

  const {
    data: allowance,
    isLoading: isCheckingAllowance,
    refetch,
  } = useContractRead({
    address: config.contractAddresses.token,
    abi: erc20ABI,
    functionName: "allowance",
    enabled: isConnected,
    args: [
      address as `0x${string}`,
      config.contractAddresses.interactionContract,
    ],
  });

  const { write: approve } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: config.contractAddresses.token,
    abi: erc20ABI,
    functionName: "approve",
    args: [
      config.contractAddresses.interactionContract,
      BigNumber.from(APPROVAL_AMOUNT),
    ],
    onSuccess(data) {
      setHash(data.hash);
      setTxnInProgress(data.hash);
    },
    onError(error) {
      setTxnError(error);
      setAction("");
    },
  });

  const { write: stake } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: config.contractAddresses.interactionContract,
    abi: config.abis.interactionContract,
    functionName: "stake",
    args: [parseEther(amount || "0")],
    onSuccess(data) {
      setHash(data.hash);
      setTxnInProgress(data.hash);
    },
    onError(error) {
      setTxnError(error);
      setAction("");
    },
  });

  const { write: unstake } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: config.contractAddresses.interactionContract,
    abi: config.abis.interactionContract,
    functionName: "unstake",
    args: [parseEther(amount || "0")],
    onSuccess(data) {
      setHash(data.hash);
      setTxnInProgress(data.hash);
    },
    onError(error) {
      setTxnError(error);
      setAction("");
    },
  });

  useWaitForTransaction({
    hash: hash as `0x${string}`,
    onSettled(_, error) {
      if (action === txnType.APPROVE) {
        refetch();
      }

      setAction("");

      if (error) {
        toast.update(toastId.current, {
          type: toast.TYPE.ERROR,
          isLoading: false,
          render: "Transaction failed",
          autoClose: 5000,
        });

        return;
      }

      toast.update(toastId.current, {
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        render: "Transaction successful",
        autoClose: 5000,
      });
    },
  });

  const checkError = useCallback(
    (op: txnType) => {
      if (!amount) {
        const error = "Invalid value.";
        setError(error);
        return error;
      }

      switch (op) {
        case txnType.STAKE:
          if (+amount > +balance) {
            const error = "Insufficient funds to stake.";
            setError(error);
            return error;
          }
          break;

        case txnType.UNSTAKE:
          if (+amount > +limit) {
            const error = "Insufficient funds to unstake.";
            setError(error);
            return error;
          }
          break;
      }
    },
    [amount]
  );

  useEffect(() => {
    setError("");
  }, [amount]);

  const handleApprove = useCallback(() => {
    initiateTxn();
    setAction(txnType.APPROVE);
    approve && approve();
  }, []);

  const handleStake = useCallback(() => {
    const error = checkError(txnType.STAKE);

    if (!error) {
      initiateTxn();
      setAction(txnType.STAKE);
      stake && stake();
    }
  }, [amount]);

  const handleUnstake = useCallback(() => {
    const error = checkError(txnType.UNSTAKE);

    if (!error) {
      initiateTxn();
      setAction(txnType.UNSTAKE);
      unstake && unstake();
    }
  }, [amount]);

  if (isCheckingAllowance) {
    return null;
  }

  const isAllowanced = useMemo(
    () => allowance && +allowance.toString(),
    [allowance]
  );

  const isUnsupportedChain = useMemo(() => chain && chain.unsupported, [chain]);

  return (
    <>
      {!!error && (
        <Text color="crimson" fontSize={12} fontWeight="semibold">
          {error}
        </Text>
      )}
      <Flex gap="1rem" {...rest} mt="1rem">
        {isUnsupportedChain ? (
          <Button
            w="100%"
            fontSize={14}
            onClick={() => switchNetwork && switchNetwork(chains[0].id)}
            disabled={!!action}
          >
            Switch Network
          </Button>
        ) : isAllowanced ? (
          <>
            <Button
              flex={1}
              fontSize={14}
              onClick={handleStake}
              disabled={!!action}
              bg="black"
              color="white"
            >
              {action === txnType.STAKE ? <ButtonSpinner /> : "Stake"}
            </Button>
            <Button
              flex={1}
              fontSize={14}
              onClick={handleUnstake}
              disabled={!!action}
            >
              {action === txnType.UNSTAKE ? <ButtonSpinner /> : "Unstake"}
            </Button>
          </>
        ) : (
          <Button
            flex={1}
            fontSize={14}
            onClick={handleApprove}
            disabled={!!action}
          >
            {action === txnType.APPROVE ? (
              <ButtonSpinner />
            ) : (
              "Enable/Approve staking"
            )}
          </Button>
        )}
      </Flex>
      <Button
        w="100%"
        my="1rem"
        fontSize={14}
        onClick={() => disconnect()}
        disabled={!!action}
      >
        Disconnect
      </Button>
    </>
  );
};

export default Actions;
