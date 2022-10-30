import { useEffect, useState } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import { useAccount, useBalance, useContractRead } from "wagmi";

// Utils
import { formatBalance, formatStakedAmount } from "utils/common";

// Config
import config from "config";

// Components
import Actions from "./components/Actions";

const StakeUnstake = () => {
  const { address, isConnected } = useAccount();

  const [amount, setAmount] = useState("");

  const { data: balance } = useBalance({
    addressOrName: address,
    token: config.contractAddresses.token,
    watch: true,
    enabled: isConnected,
  });

  const { data: stakedAmount, refetch } = useContractRead({
    address: config.contractAddresses.interactionContract,
    abi: config.abis.interactionContract,
    functionName: "stakedAmount",
    enabled: isConnected,
    args: [address],
  });

  useEffect(() => {
    (async function fetchData() {
      await refetch();
    })();
  }, [balance]);

  return (
    <Box
      pt={0}
      bg="white"
      borderRadius={8}
      minW={{ base: "fit-content", md: 350 }}
      minH={400}
    >
      <Text p={8} bg="black" color="white" borderTopRadius={8}>
        Balance:
        <Text as="span" fontWeight="semibold" ml={2} fontSize={20}>
          {formatBalance(balance)} {balance?.symbol}
        </Text>
      </Text>
      <Box px={8} mt={2}>
        <Text fontSize={14}>Amount you staked</Text>
        <Box
          p="0.5rem 1rem"
          border="1px solid #F0F1F5"
          borderRadius={4}
          mt={2}
          mb={12}
        >
          <Text>{balance?.symbol}</Text>
          <Text fontWeight="semibold" fontSize={24}>
            {formatStakedAmount(stakedAmount)} {balance?.symbol}
          </Text>
        </Box>
        <Box>
          <Text mb="0.5rem" fontSize={14}>
            Stake or Unstake your Amount
          </Text>
          <Input
            value={amount}
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </Box>
        <Actions
          amount={amount}
          balance={formatBalance(balance).toString()}
          limit={formatStakedAmount(stakedAmount).toString()}
          mt="1rem"
        />
      </Box>
    </Box>
  );
};

export default StakeUnstake;
