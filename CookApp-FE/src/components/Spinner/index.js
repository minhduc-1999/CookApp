import { Spinner } from "@chakra-ui/react";
export default (props) => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="teal.300"
      size="xl"
      {...props}
    />
  );
};
