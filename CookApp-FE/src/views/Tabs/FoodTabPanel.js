import React, { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import FoodTable from "components/Tables/FoodTable";
import Paginator from "components/Tables/Paginator";
import { getFoods } from "apis/foods";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const FoodTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const [foods, setFoods] = useState({});
  const [foodloading, setFoodLoading] = useState(true);
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
  }, []);

  const fetchFoodData = (page, size) => {
    getFoods(page, size)
      .then((data) => {
        if (data.metadata.totalPage !== totalFoodPage)
          setTotalFoodPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalFood)
          setTotalFood(data.metadata.totalCount);
        const temp = { ...foods };
        temp[page] = data.foods;
        setFoods(temp);
        setFoodLoading(false);
      })
      .catch((err) => {
        setFoodLoading(true);
        console.error(err);
      });
  };

  const handleFoodPageChange = (nextPage) => {
    if (!foods[nextPage] || foods[nextPage].length !== foodPageSize) {
      if (nextPage === totalFoodPage) {
        if (foods[nextPage]?.length === totalFood % foodPageSize) {
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
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Foods Table
            </Text>
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
    </Flex>
  );
};

export default FoodTabPanel;
