import {
  Tr,
  Th,
  Thead,
  Tbody,
  Table,
  useColorModeValue,
  TableContainer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import IngredientRow from "./IngredientRow";

function IngredientTable({ ingredients, curPage, limit }) {
  const textColor = useColorModeValue("gray.700", "white");
  const [ingredientList, setIngredientList] = useState([]);

  const getList = (curPage) => {
    setIngredientList(ingredients[curPage]);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage]);

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
              key={row.id}
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
