import {
  Tr,
  Th,
  Thead,
  Tbody,
  Table,
  useColorModeValue,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import IngredientRow from "./IngredientRow";
import { IngredientResponse } from "apis/base.type";

type Props = {
  ingredients: {
    [key: number]: IngredientResponse[];
  };
  curPage: number;
  limit: number;
};

function IngredientTable({ ingredients, curPage, limit }: Props) {
  const textColor = useColorModeValue("gray.700", "white");
  const [ingredientList, setIngredientList] = useState<IngredientResponse[]>(
    []
  );

  const getList = (curPage: number) => {
    const temp = ingredients[curPage];
    if (temp) setIngredientList(temp);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage, ingredients]);

  return (
    <TableContainer w="100%">
      <Table variant="simple" color={textColor}>
        <Thead>
          <Tr my=".8rem" pl="0px" color="gray.400">
            <Th pl="0px" color="gray.400">
              Index
            </Th>
            <Th color="gray.400">Name</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {ingredientList?.map((row, index) => (
            <IngredientRow
              key={row.name}
              index={(curPage - 1) * limit + index}
              data={row}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

IngredientTable.propTypes = {
  ingredients: PropTypes.object,
  curPage: PropTypes.number,
  limit: PropTypes.number,
};

export default IngredientTable;
