import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RoleResponse } from "apis/base.type";
import {
  checkPasswordConstrain,
  checkPhoneConstrain,
  checkUsernameConstrain,
  createUser,
} from "apis/users";
import { PasswordInput } from "components/PasswordInput/PasswordInput";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";
import { getRoles } from "../../apis/roles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  saveCb: () => void;
};

const INIT_PAGE_SIZE = 50;
const INIT_PAGE = 1;

type CreateUserErrorType =
  | "usernameError"
  | "passwordError"
  | "emailError"
  | "phoneError"
  | "roleError"
  | "none";

const CreateAccountModal = ({ isOpen, onClose, saveCb }: Props) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [roleList, setRoleList] = useState<RoleResponse[]>([]);
  const toast = useToast();
  const { user } = useAuth();

  const [error, setError] = useState<CreateUserErrorType>("none");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getRoles(user?.accessToken, INIT_PAGE, INIT_PAGE_SIZE).then((data) => {
      const [roles] = data;
      setRoleList(roles);
    });
  }, []);

  const checkSaving = () => {
    const userNameCheckError = checkUsernameConstrain(username);
    if (userNameCheckError) {
      setError("usernameError");
      setErrorMsg(userNameCheckError.message);
      return false;
    }
    const passwordCheckError = checkPasswordConstrain(rawPassword);
    if (passwordCheckError) {
      setError("passwordError");
      setErrorMsg(passwordCheckError.message);
      return false;
    }
    const phoneCheckError = checkPhoneConstrain(phone);
    if (phoneCheckError) {
      setError("phoneError");
      setErrorMsg(phoneCheckError.message);
      return false;
    }
    switch (true) {
      case !email:
        setError("emailError");
        return false;
      case !role:
        return false;
    }
    return true;
  };

  const clearAll = () => {
    setUsername("");
    setRawPassword("");
    setEmail("");
    setPhone("");
    setRole("");
  };

  const onSaveUser = () => {
    if (!checkSaving()) return;
    setSaving(true);
    createUser(
      {
        username,
        phone,
        email,
        role,
        rawPassword,
      },
      user?.accessToken
    )
      .then(() => {
        toast({
          title: "Account created",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        clearAll();
        onClose();
        saveCb();
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const onInputFocus = () => {
    setError("none");
    setErrorMsg("");
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl
              isRequired
              isInvalid={error === "usernameError"}
              onFocus={onInputFocus}
            >
              <FormLabel htmlFor="name">Username</FormLabel>
              <Input
                id="username"
                ref={initialRef}
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              {error === "usernameError" && (
                <FormErrorMessage>{errorMsg}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error === "passwordError"}
              onFocus={onInputFocus}
            >
              <FormLabel htmlFor="password">Password</FormLabel>
              <PasswordInput
                id="password"
                placeholder="Password"
                value={rawPassword}
                onChange={(e) => {
                  setRawPassword(e.target.value);
                }}
              />{" "}
              {error === "passwordError" && (
                <FormErrorMessage>{errorMsg}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error === "emailError"}
              onFocus={onInputFocus}
            >
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {error === "emailError" && (
                <FormErrorMessage>{errorMsg}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error === "phoneError"}
              onFocus={onInputFocus}
            >
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
              {error === "phoneError" && (
                <FormErrorMessage>{errorMsg}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error === "roleError"}
              onFocus={onInputFocus}
            >
              <FormLabel htmlFor="role">Role</FormLabel>
              <Select
                placeholder="Role..."
                value={role ? role : undefined}
                onChange={(e) => {
                  const { value } = e.target;
                  setRole(value);
                }}
              >
                {roleList?.map((role, index) => (
                  <option key={index} value={role.sign}>
                    {role.title}
                  </option>
                ))}
              </Select>
              {error === "roleError" && (
                <FormErrorMessage>{errorMsg}</FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {saving ? (
            <Button
              isLoading
              loadingText="Saving"
              colorScheme="teal"
              variant="outline"
            />
          ) : (
            <Button colorScheme="teal" onClick={onSaveUser}>
              Save
            </Button>
          )}
          <Button ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountModal;
