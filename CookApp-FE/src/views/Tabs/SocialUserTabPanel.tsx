import React, { useState, useEffect, useRef } from "react";
import Spinner from "components/Spinner";
import {
  Button,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import { RoleResponse, UserResponse } from "apis/base.type";
import UserTable from "components/Tables/UserTable";
import { changeRole, getUsers } from "apis/users";
import { getRoles } from "apis/roles";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const INIT_ROLE_PAGE_SIZE = 50;
const INIT_ROLE_PAGE = 1;

type TabContextType = {
  onChangeRoleTrigger: (userId: string) => void;
};
export const SocialUserTabContext = React.createContext<TabContextType | undefined>(
  undefined
);

const SocialUserTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const [users, setUsers] = useState<{
    [key: number]: UserResponse[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [totalUserPage, setTotalUserPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const [roleList, setRoleList] = useState<RoleResponse[]>([]);
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<string>();

  const { currentPage, setCurrentPage, pageSize } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [changeRoleUserId, setChangeRoleUserId] = useState("");

  const initialRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    getRoles(INIT_ROLE_PAGE, INIT_ROLE_PAGE_SIZE).then((data) => {
      const [roles] = data;
      setRoleList(roles);
    });
  }, []);

  const fetchData = (page: number, size: number) => {
    getUsers(page, size)
      .then((data) => {
        const [usersResult, metadata] = data;
        if (metadata.totalPage !== totalUserPage)
          setTotalUserPage(metadata.totalPage);
        if (metadata.totalCount !== totalUser)
          setTotalUser(metadata.totalCount);
        const temp = { ...users };
        temp[page] = usersResult;
        setUsers(temp);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        console.error(err);
      });
  };

  const handlePageChange = (nextPage: number) => {
    const temp = users[nextPage];
    if (!temp || temp.length !== pageSize) {
      if (nextPage === totalUserPage) {
        if (temp?.length === totalUser % pageSize) {
          setCurrentPage(nextPage);
          return;
        }
      }
      setLoading(true);
      fetchData(nextPage, pageSize);
    }
    setCurrentPage(nextPage);
  };

  const onChangeRoleTrigger = (userId: string) => {
    setChangeRoleUserId(userId);
    onOpen();
  };

  return (
    <SocialUserTabContext.Provider value={{ onChangeRoleTrigger }}>
      <Flex direction="column">
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Social Users
            </Text>
          </CardHeader>
          <CardBody justifyContent="center" alignItems="center">
            {loading ? (
              <Spinner />
            ) : (
              <UserTable users={users} limit={pageSize} curPage={currentPage} />
            )}
          </CardBody>
          <Flex mt="20px" justifyContent="end">
            <Paginator
              pagesQuantity={totalUserPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Flex>
        </Card>
        <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Pick new role</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired isInvalid={role ? false : true}>
                <Select
                  ref={initialRef}
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
                    if (role) {
                      changeRole({ sign: role, userId: changeRoleUserId })
                        .then(() => {
                          toast({
                            title: "Successfully",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                            position: "top-right",
                          });
                          fetchData(currentPage, pageSize)
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
                          onClose();
                        });
                    }
                  }}
                  disabled={!role}
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
      </Flex>
    </SocialUserTabContext.Provider>
  );
};

export default SocialUserTabPanel;
