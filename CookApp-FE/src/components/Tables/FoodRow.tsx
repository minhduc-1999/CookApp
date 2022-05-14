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
import { OptionIcon } from "components/Icons/Icons";
import { calendarTime } from "utils/time";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { durationFormat } from "utils/time";
import { FoodResponse } from "apis/base.type";

type Props = {
  data: FoodResponse;
  index: number;
};

function FoodRow(props: Props) {
  const { name, createdAt, totalTime, servings, photos } = props.data;
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
          <Avatar
            src={photos[0] ? photos[0].url : ""}
            w="50px"
            borderRadius="12px"
            me="18px"
          />
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {name}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {servings}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {durationFormat(totalTime)}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {calendarTime(createdAt)}
        </Text>
      </Td>

      <Td isNumeric>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<OptionIcon />}
            variant="outline"
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

export default FoodRow;
