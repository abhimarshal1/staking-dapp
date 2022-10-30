import { ButtonProps, Button } from "@chakra-ui/react";

const ButtonComponent = ({ children, ...rest }: ButtonProps) => {
  return (
    <Button
      bg="black"
      color="white"
      _hover={{
        color: "black",
        bg: "#F0F1F5",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
