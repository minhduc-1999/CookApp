import React, { useState, useEffect } from "react";
// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import { tablesProjectData } from "variables/general";
import Paginator from "components/Tables/Paginator";
import UserTable from "components/Tables/UserTable";
import { getUsers } from "dummy/users";
import Spinner from "components/Spinner";
import { usePaginator } from "chakra-paginator";

const PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

function Users() {
  const textColor = useColorModeValue("gray.700", "white");
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalUserPage, setTotalUserPage] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const { currentPage, setCurrentPage, pageSize } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: PAGE_SIZE },
  });

  useEffect(() => {
    fetchData(INIT_CUR_PAGE);
  }, []);

  const fetchData = (page) => {
    getUsers(page, pageSize)
      .then((data) => {
        if (data.metadata.totalPage !== totalUserPage)
          setTotalUserPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalUser)
          setTotalUser(data.metadata.totalCount);
        const temp = { ...users };
        temp[page] = data.users;
        setUsers(temp);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        console.error(err);
      });
  };

  const handlePageChange = (nextPage) => {
    if (!users[nextPage] || users[nextPage].length !== pageSize) {
      if (nextPage === totalUserPage) {
        if (users[nextPage]?.length === totalUser % pageSize) {
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
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Users Table
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
      <Card my="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Projects Table
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px">
                <Th pl="0px" color="gray.400">
                  Companies
                </Th>
                <Th color="gray.400">Budget</Th>
                <Th color="gray.400">Status</Th>
                <Th color="gray.400">Completion</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesProjectData.map((row) => {
                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    status={row.status}
                    budget={row.budget}
                    progression={row.progression}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Users;
