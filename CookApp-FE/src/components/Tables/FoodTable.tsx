import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import FoodDetailModal from "components/Modals/FoodDetailModal";
import { useEffect, useState } from "react";
import FoodRow from "./FoodRow";

type Props = {
  foods: {
    [key: number]: FoodResponse[];
  };
  curPage: number;
  limit: number;
};

function FoodTable({ foods, curPage, limit }: Props) {
  const textColor = useColorModeValue("gray.700", "white");
  const [foodList, setFoodList] = useState<FoodResponse[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState("");

  const {
    isOpen: isFoodDetailOpen,
    onOpen: onFoodDetailOpen,
    onClose: onFoodDetailClose,
  } = useDisclosure();

  useEffect(() => {
    getList(curPage);
  }, [curPage]);

  const getList = (curPage: number) => {
    const curPageList = foods[curPage];
    curPageList && setFoodList(curPageList);
  };

  return (
    <>
      <TableContainer w="100%">
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
                onSelect={() => {
                  onFoodDetailOpen();
                  setSelectedFoodId(row.id);
                }}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <FoodDetailModal
        foodId={selectedFoodId}
        isOpen={isFoodDetailOpen}
        onClose={onFoodDetailClose}
      />
    </>
  );
}

export default FoodTable;
