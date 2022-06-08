import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
// Assets
import ProfileBgImage from "assets/img/ProfileBackground.png";
import { useEffect, useState } from "react";
import { PasswordInput } from "components/PasswordInput/PasswordInput";
import { changePassword, getProfile, GetProfileResponse } from "apis/auth";
import { useAuth } from "contexts/Auth/Auth";

function Profile() {
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setChangePasswordError] = useState("");
  const [profile, setProfile] = useState<GetProfileResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    getProfile(user?.accessToken).then((profile) => {
      setProfile(profile);
    });
  }, []);
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  const borderProfileColor = useColorModeValue(
    "white",
    "rgba(255, 255, 255, 0.31)"
  );
  const emailColor = useColorModeValue("gray.400", "gray.300");

  const setPasswordMatchingErr = (isError: boolean) => {
    if (isError) setChangePasswordError("Confirm password is incorrect");
    else setChangePasswordError("");
  };

  const canChangePassword = () => {
    if (
      oldPassword !== "" &&
      newPassword !== "" &&
      newPassword === confirmNewPassword
    )
      return true;
    return false;
  };

  const clear = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setChangePasswordError("");
  };

  const onSaveChangePassword = () => {
    changePassword({ oldPassword, newPassword }, user?.accessToken)
      .then(() => {
        clear();
        toast({
          title: "Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Box
        mb={{ sm: "205px", md: "75px", xl: "70px" }}
        borderRadius="15px"
        px="0px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          bgImage={ProfileBgImage}
          w="100%"
          h="300px"
          borderRadius="25px"
          bgPosition="50%"
          bgRepeat="no-repeat"
          position="relative"
          display="flex"
          justifyContent="center"
        >
          <Flex
            direction={{ sm: "column", md: "row" }}
            mx="1.5rem"
            maxH="330px"
            w={{ sm: "90%", xl: "95%" }}
            justifyContent={{ sm: "center", md: "space-between" }}
            align="center"
            backdropFilter="saturate(200%) blur(50px)"
            position="absolute"
            boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
            border="2px solid"
            borderColor={borderProfileColor}
            bg={bgProfile}
            p="24px"
            borderRadius="20px"
            transform={{
              sm: "translateY(45%)",
              md: "translateY(110%)",
              lg: "translateY(160%)",
            }}
          >
            <Flex
              align="center"
              mb={{ sm: "10px", md: "0px" }}
              direction={{ sm: "column", md: "row" }}
              w={{ sm: "100%" }}
              textAlign={{ sm: "center", md: "start" }}
            >
              <Avatar
                me={{ md: "22px" }}
                src={profile?.avatar?.url ?? ""}
                w="80px"
                h="80px"
                borderRadius="15px"
              />
              <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
                <Text
                  fontSize={{ sm: "lg", lg: "xl" }}
                  color={textColor}
                  fontWeight="bold"
                  ms={{ sm: "8px", md: "0px" }}
                >
                  {profile?.displayName}
                </Text>
                <Text
                  fontSize={{ sm: "sm", md: "md" }}
                  color={emailColor}
                  fontWeight="semibold"
                >
                  {user?.email}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Card p="16px" my="24px">
        <CardHeader p="12px 5px" mb="12px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Change password
            </Text>
          </Flex>
        </CardHeader>
        <CardBody px="5px">
          <Flex direction="column" alignItems="center" width={"100%"}>
            <FormControl maxWidth={"300px"} mb="24px" isRequired>
              <PasswordInput
                id="old-password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl
              maxWidth={"300px"}
              mb="24px"
              isRequired
              isInvalid={passwordError !== ""}
            >
              <PasswordInput
                id="new-password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => {
                  const { value } = e.target;
                  setNewPassword(value);
                  setPasswordMatchingErr(value !== confirmNewPassword);
                }}
              />
            </FormControl>
            <FormControl
              maxW="300px"
              mb="24px"
              isRequired
              isInvalid={passwordError !== ""}
            >
              <PasswordInput
                id="confirm-password"
                value={confirmNewPassword}
                onChange={(e) => {
                  const { value } = e.target;
                  setConfirmNewPassword(value);
                  setPasswordMatchingErr(value !== newPassword);
                }}
                placeholder="Confirm new password"
              />
              {passwordError !== "" ? (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              ) : null}
            </FormControl>
            <Button
              maxW={"300px"}
              w="100%"
              onClick={onSaveChangePassword}
              disabled={!canChangePassword()}
              colorScheme="teal"
            >
              Save
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Profile;
