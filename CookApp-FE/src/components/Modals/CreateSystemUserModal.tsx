import {
  Button,
  FormControl,
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
import { canSaveSystemUser, CreateSystemUserBody } from "apis/users";
import { useEffect, useRef, useState } from "react";
import { getRoles } from "../../apis/roles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const saveSystemUser = async (body: CreateSystemUserBody) => {
  // TODO
  console.log(body);
};
const INIT_PAGE_SIZE = 50;
const INIT_PAGE = 1;

const CreateAccountModal = ({ isOpen, onClose }: Props) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [rawPassword, setRawPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [canSave, setCanSave] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roleList, setRoleList] = useState<RoleResponse[]>([]);
  const toast = useToast();

  useEffect(() => {
    let checkSavingInterval: NodeJS.Timer;
    if (isOpen)
      checkSavingInterval = setInterval(() => {
        checkSaving();
      }, 500);

    return () => {
      if (checkSavingInterval) clearInterval(checkSavingInterval);
    };
  }, [isOpen, username]);

  useEffect(() => {
    getRoles(INIT_PAGE, INIT_PAGE_SIZE).then((data) => {
      const [roles] = data;
      setRoleList(roles);
    });
  }, []);

  const checkSaving = () => {
    if (
      canSaveSystemUser({
        username,
        email,
        rawPassword,
        phone,
        role,
      })
    ) {
      setCanSave(true);
      return;
    }
    setCanSave(false);
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
            <FormControl isRequired isInvalid={username ? false : true}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                ref={initialRef}
                placeholder="Name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={rawPassword ? false : true}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                placeholder="Password"
                value={rawPassword}
                onChange={(e) => {
                  setRawPassword(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <Input
                id="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={role ? false : true}>
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
            <Button
              colorScheme="teal"
              onClick={() => {
                setSaving(true);
                saveSystemUser({
                  username,
                  phone,
                  email,
                  role,
                  rawPassword,
                })
                  .then(() => {
                    toast({
                      title: "Account created",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                    onClose();
                  })
                  .catch(() => {
                    toast({
                      title: "Fail to create account",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                  })
                  .finally(() => {
                    setSaving(false);
                  });
              }}
              disabled={!canSave}
            >
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
