import {
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { IngredientResponse } from "apis/base.type";
import RowMenuOption from "components/Menu/RowMenuOption";

type Props = {
  data: IngredientResponse;
  index: number;
};

function IngredientRow(props: Props) {
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
        <RowMenuOption remove />
      </Td>
    </Tr>
  );
}

export default IngredientRow;
