import { useState } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/tastify-bg.png"
import { useAuth } from "contexts/Auth/Auth";
import { useHistory, useLocation } from "react-router-dom";
import { validatePassword, validateUsername } from "apis/auth";
import { PasswordInput } from "components/PasswordInput/PasswordInput";

function SignIn() {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  const authContext = useAuth();
  const history = useHistory();
  const location: {
    state: {
      from: any;
    };
  } = useLocation();

  const { from } = location?.state || {
    from: { pathname: "/" },
  };

  const signIn = () => {
    authContext
      ?.signIn({ username, password }, () => {
        history.replace(from);
      })
      .catch((err: Error) => {
        setLoginError(err.message);
      });
  };

  const canLogin = () => {
    return usernameError || passwordError || username == "" || password === ""
      ? false
      : true;
  };

  const onInputFocus = () => {
    setLoginError("");
  };

  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Welcome Back
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Enter your username/email and password to sign in
            </Text>
            <FormControl mb="24px" isRequired isInvalid={usernameError !== ""}>
              <FormLabel
                htmlFor="username"
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
              >
                Username/Email
              </FormLabel>
              <Input
                id="username"
                fontSize="sm"
                type="text"
                placeholder="Your username/email adress"
                size="lg"
                value={username}
                onFocus={onInputFocus}
                onChange={(e) => {
                  setUsername(e.target.value);
                  const err = validateUsername(e.target.value);
                  if (err) {
                    setUsernameError(err.message);
                    return;
                  }
                  setUsernameError("");
                }}
              />
              {usernameError !== "" ? (
                <FormErrorMessage>{usernameError}</FormErrorMessage>
              ) : null}
            </FormControl>
            <FormControl mb="24px" isRequired isInvalid={passwordError !== ""}>
              <FormLabel
                htmlFor="password"
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
              >
                Password
              </FormLabel>
              <PasswordInput
                id="password"
                placeholder="Your password"
                value={password}
                onFocus={onInputFocus}
                onChange={(e) => {
                  setPassword(e.target.value);
                  const err = validatePassword(e.target.value);
                  if (err) {
                    setPasswordError(err.message);
                    return;
                  }
                  setPasswordError("");
                }}
              />
              {passwordError !== "" ? (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              ) : null}
            </FormControl>
            {loginError && (
              <Alert mb="24px" status="error" borderRadius="15px">
                <AlertIcon />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <Button
              fontSize="10px"
              type="submit"
              bg="teal.300"
              w="100%"
              h="45"
              mb="20px"
              color="white"
              _hover={{
                bg: "teal.200",
              }}
              _active={{
                bg: "teal.400",
              }}
              onClick={signIn}
              disabled={!canLogin()}
            >
              SIGN IN
            </Button>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
