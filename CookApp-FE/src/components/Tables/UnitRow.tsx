import {
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
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaEllipsisV } from "react-icons/fa";
import { UnitResponse } from "apis/base.type";

type Props = {
  data: UnitResponse;
  index: number;
};

function UnitRow(props: Props) {
  const { name } = props.data;
  const index = props.index + 1;
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tr>
      <Td pl="0px">
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {index}
        </Text>
      </Td>

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {name}
        </Text>
      </Td>

      <Td isNumeric w="8px">
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

export default UnitRow;
