import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import { getFoods } from "apis/foods";
import { usePaginator } from "chakra-paginator";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CreateFoodModal from "components/Modals/CreateFoodModal";
import Spinner from "components/Spinner";
import FoodTable from "components/Tables/FoodTable";
import Paginator from "components/Tables/Paginator";
import { useEffect, useState } from "react";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const FoodTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [foods, setFoods] = useState<{
    [key: number]: FoodResponse[];
  }>({});
  const [foodloading, setFoodLoading] = useState(false);
  const [totalFoodPage, setTotalFoodPage] = useState(0);
  const [totalFood, setTotalFood] = useState(0);

  const {
    currentPage: currentFoodPage,
    setCurrentPage: setCurrentFoodPage,
    pageSize: foodPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchFoodData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    setFoodLoading(true);
  }, []);

  const fetchFoodData = (page: number, size: number) => {
    getFoods(page, size)
      .then((data) => {
        const [foodResList, metadata] = data;
        if (metadata.totalPage !== totalFoodPage)
          setTotalFoodPage(metadata.totalPage);
        if (metadata.totalCount !== totalFood)
          setTotalFood(metadata.totalCount);
        const temp = { ...foods };
        temp[page] = foodResList;
        setFoods(temp);
        setFoodLoading(false);
      })
      .catch((err) => {
        setFoodLoading(true);
        console.error(err);
      });
  };

  const handleFoodPageChange = (nextPage: number) => {
    const foodList = foods[nextPage];
    if (!foodList || foodList.length !== foodPageSize) {
      if (nextPage === totalFoodPage) {
        if (foodList?.length === totalFood % foodPageSize) {
          setCurrentFoodPage(nextPage);
          return;
        }
      }
      setFoodLoading(true);
      fetchFoodData(nextPage, foodPageSize);
    }
    setCurrentFoodPage(nextPage);
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      {foodloading ? (
        <Spinner />
      ) : (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px" justifyContent="space-between">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Foods Table
            </Text>
            <HStack spacing="10px">
              <Button
                leftIcon={<AddIcon />}
                variant="ghost"
                colorScheme="teal"
                onClick={onOpen}
              >
                Add food
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <FoodTable
              foods={foods}
              limit={foodPageSize}
              curPage={currentFoodPage}
            />
          </CardBody>
          <Flex mt="20px" justifyContent="end">
            <Paginator
              pagesQuantity={totalFoodPage}
              currentPage={currentFoodPage}
              onPageChange={handleFoodPageChange}
            />
          </Flex>
        </Card>
      )}
      <CreateFoodModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default FoodTabPanel;
