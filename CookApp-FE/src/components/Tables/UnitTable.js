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
import UnitRow from "./UnitRow";

function UnitTable({ units, curPage, limit }) {
  const textColor = useColorModeValue("gray.700", "white");
  const [unitList, setUnitList] = useState([]);

  const getList = (curPage) => {
    console.log(units)
    setUnitList(units[curPage]);
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
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {unitList?.map((row, index) => (
          <UnitRow
            key={row.id}
            index={(curPage - 1) * limit + index}
            data={row}
          />
        ))}
      </Tbody>
    </Table>
  );
}

UnitTable.propTypes = {
  units: PropTypes.object,
  curPage: PropTypes.number,
  limit: PropTypes.number,
};

export default UnitTable;
