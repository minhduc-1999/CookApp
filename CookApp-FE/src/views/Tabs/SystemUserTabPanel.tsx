import { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import { getUsers } from "dummy/users";
import { UserResponse } from "apis/base.type";
import UserTable from "components/Tables/UserTable";
import { FaPlus } from "react-icons/fa";
import CreateSystemUserModal from "components/Modals/CreateSystemUserModal";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const SystemlUserTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const [users, setUsers] = useState<{
    [key: number]: UserResponse[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [totalUserPage, setTotalUserPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { currentPage, setCurrentPage, pageSize } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
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
  return (
    <Flex direction="column">
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px" justifyContent="space-between">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            System Users
          </Text>
          <HStack spacing="10px">
            <Button
              leftIcon={<FaPlus />}
              variant="ghost"
              colorScheme="teal"
              onClick={onOpen}
            >
              Add account
            </Button>
          </HStack>
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
      <CreateSystemUserModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  );
};

export default SystemlUserTabPanel;
