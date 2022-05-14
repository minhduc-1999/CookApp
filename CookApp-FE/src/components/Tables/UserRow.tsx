import {
  Avatar,
  Flex,
  Td,
  Text,
  Tr,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { calendarTime } from "utils/time";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaCheckSquare, FaEllipsisV } from "react-icons/fa";
import RoleTag from "components/Tags/RoleTag";
import { IoWarning } from "react-icons/io5";
import { UserResponse } from "apis/base.type";

type UserRowProps = {
  data: UserResponse;
  index: number;
};

function UserRow(props: UserRowProps) {
  const {
    username,
    email,
    phoneNumber,
    emailVerification,
    createdAt,
    displayName,
    avatar,
    role,
  } = props.data;
  const index = props.index + 1;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Td pl="0px">
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {index}
        </Text>
      </Td>
      <Td minWidth={{ sm: "250px" }}>
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Avatar src={avatar.url} w="50px" borderRadius="12px" me="18px" />
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {displayName}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {email}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {username}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {phoneNumber}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {calendarTime(createdAt)}
        </Text>
      </Td>

      <Td>
        <Flex justifyContent="center">
          {emailVerification ? (
            <FaCheckSquare color="green" size="24px" />
          ) : (
            <IoWarning color={"red"} size="24px" />
          )}
        </Flex>
      </Td>

      <Td>
        <RoleTag data={{ roleName: role?.name, roleSign: role?.sign }} />
      </Td>

      <Td>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FaEllipsisV />}
            variant="solid"
            bgColor={"inherit"}
          />
          <MenuList>
            <MenuItem icon={<EditIcon />}>Edit</MenuItem>
            <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}

export default UserRow;
