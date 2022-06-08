import { Td, Text, Tr, useColorModeValue } from "@chakra-ui/react";
import { IngredientResponse } from "apis/base.type";
import RowMenuOption from "components/Menu/RowMenuOption";
import { useContext } from "react";
import { IngredientTabContext } from "views/Tabs/IngredientTabPanel";

type Props = {
  data: IngredientResponse;
  index: number;
};

function IngredientRow(props: Props) {
  const { name, id } = props.data;
  const index = props.index + 1;
  const textColor = useColorModeValue("gray.700", "white");

  const tabContext = useContext(IngredientTabContext);

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
        <RowMenuOption
          remove
          onRemoveClick={() => {
            tabContext?.onRemoveTrigger && tabContext.onRemoveTrigger(id);
          }}
        />
      </Td>
    </Tr>
  );
}

export default IngredientRow;
