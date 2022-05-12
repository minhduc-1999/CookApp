import {
  Tr,
  Th,
  Thead,
  Tbody,
  Table,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserRow from "./UserRow";

function UserTable({ users, curPage, limit }) {
  const textColor = useColorModeValue("gray.700", "white");
  const [userList, setUserList] = useState([]);

  const getList = (curPage) => {
    setUserList(users[curPage]);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage]);

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr my=".8rem" pl="0px" color="gray.400">
          <Th pl="0px" color="gray.400">
            ID
          </Th>
          <Th color="gray.400">Display</Th>
          <Th color="gray.400">Username</Th>
          <Th color="gray.400">Phone</Th>
          <Th color="gray.400">Created At</Th>
          <Th color="gray.400">Email Verification</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {userList.map((row, index) => {
          return (
            <UserRow
              key={row.id}
              index={(curPage - 1) * limit + index}
              data={row}
            />
          );
        })}
      </Tbody>
    </Table>
  );
}

UserTable.propTypes = {
  users: PropTypes.array,
  curPage: PropTypes.number,
  limit: PropTypes.number,
};

export default UserTable;
