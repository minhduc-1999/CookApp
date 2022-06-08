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
import UnitRow from "./UnitRow";
import { UnitResponse } from "apis/base.type";

type Props = {
  units: {
    [key: number]: UnitResponse[];
  };
  curPage: number;
  limit: number;
};

function UnitTable({ units, curPage, limit }: Props) {
  const textColor = useColorModeValue("gray.700", "white");
  const [unitList, setUnitList] = useState<UnitResponse[]>([]);

  const getList = (curPage: number) => {
    const temp = units[curPage];
    if (temp) setUnitList(temp);
  };

  useEffect(() => {
    getList(curPage);
  }, [curPage, units]);

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
          {unitList?.map((row, index) => (
            <UnitRow
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

UnitTable.propTypes = {
  units: PropTypes.object,
  curPage: PropTypes.number,
  limit: PropTypes.number,
};

export default UnitTable;
