import { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import { getUsers } from "dummy/users";
import { UserResponse } from "apis/base.type";
import UserTable from "components/Tables/UserTable";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const SocialUserTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const [users, setUsers] = useState<{
    [key: number]: UserResponse[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [totalUserPage, setTotalUserPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const { currentPage, setCurrentPage, pageSize } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchData(INIT_CUR_PAGE);
  }, []);

  const fetchData = (page: number) => {
    getUsers(page, pageSize)
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
      fetchData(nextPage);
    }
    setCurrentPage(nextPage);
  };
  return (
    <Flex direction="column">
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Social Users
          </Text>
        </CardHeader>
        <CardBody>
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
    </Flex>
  );
};

export default SocialUserTabPanel;
