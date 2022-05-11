import {
  Tr,
  Th,
  Thead,
  Tbody,
  Table,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FoodRow from "./FoodRow";

function FoodTable({ foods, curPage, limit }) {
  const textColor = useColorModeValue("gray.700", "white");
  const [foodList, setFoodList] = useState([]);

  const getList = (curPage) => {
    setFoodList(foods[curPage]);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage]);

  return (
    <Table variant="simple" color={textColor}>
      <Thead>
        <Tr my=".8rem" pl="0px" color="gray.400">
          <Th pl="0px" color="gray.400">
            Index
          </Th>
          <Th color="gray.400">Name</Th>
          <Th color="gray.400">Servings</Th>
          <Th color="gray.400">Total Time</Th>
          <Th color="gray.400">Created At</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {foodList?.map((row, index) => (
          <FoodRow
            key={row.id}
            index={(curPage - 1) * limit + index}
            data={row}
          />
        ))}
      </Tbody>
    </Table>
  );
}

FoodTable.propTypes = {
  foods: PropTypes.array,
  curPage: PropTypes.number,
  limit: PropTypes.number,
};

export default FoodTable;
