import {
  Avatar,
  Badge,
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
import { OptionIcon } from "components/Icons/Icons";
import React from "react";
import { calendarTime } from "utils/time";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"

function UserRow(props) {
  const { username, email, phone, emailVerification, createdAt, displayName, avatar } = props.data;
  const index = props.index + 1;
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");

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
          {phone}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {calendarTime(createdAt)}
        </Text>
      </Td>

      <Td>
        <Badge
          bg={emailVerification ? "green.400" : bgStatus}
          color={emailVerification ? "white" : colorStatus}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
        >
          {emailVerification ? "Đã xác thực" : "Chưa xác thực"}
        </Badge>
      </Td>

      <Td>
        {
          /* 
          <Button p="0px" bg="transparent" variant="no-hover">
              <Text
                fontSize="md"
                color="gray.400"
                fontWeight="bold"
                cursor="pointer">
                Edit
              </Text>
            </Button>
          */
        }
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<OptionIcon />}
            variant='outline'
          />
          <MenuList>
            <MenuItem icon={<EditIcon />}>
              Edit
            </MenuItem>
            <MenuItem icon={<DeleteIcon />}>
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
  );
}

export default UserRow;
