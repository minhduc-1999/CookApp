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
import { OptionIcon } from "components/Icons/Icons";
import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";

function FoodRow(props) {
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

      <Td
        isNumeric
        w="8px"
      >
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

FoodRow.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
};

export default FoodRow;
