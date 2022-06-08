import {
  Tr,
  Th,
  Thead,
  Tbody,
  Table,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserRow from "./UserRow";
import { UserResponse } from "apis/base.type";

type UserTableProps = {
  users: {
    [key: number]: UserResponse[];
  };
  curPage: number;
  limit: number;
};
function UserTable({ users, curPage, limit }: UserTableProps) {
  const textColor = useColorModeValue("gray.700", "white");
  const [userList, setUserList] = useState<UserResponse[]>([]);

  const getList = (curPage: number) => {
    const temp = users[curPage];
    if (temp) setUserList(temp);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage, users]);

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
          <Th color="gray.400" textAlign={"center"}>
            Email Verification
          </Th>
          <Th color="gray.400">Role</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {userList.map((row, index) => {
          return (
            <UserRow
              key={index}
              index={(curPage - 1) * limit + index}
              data={row}
            />
          );
        })}
      </Tbody>
    </Table>
  );
}

export default UserTable;
