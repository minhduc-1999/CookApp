import { Td, Text, Tr, useColorModeValue } from "@chakra-ui/react";
import { UnitResponse } from "apis/base.type";
import RowMenuOption from "components/Menu/RowMenuOption";
import { useContext } from "react";
import { UnitTabContext } from "views/Tabs/UnitTabPanel";

type Props = {
  data: UnitResponse;
  index: number;
};

function UnitRow(props: Props) {
  const { toGram, name, id } = props.data;
  const index = props.index + 1;
  const textColor = useColorModeValue("gray.700", "white");

  const tabContext = useContext(UnitTabContext);

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

      <Td>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {toGram}
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

export default UnitRow;
