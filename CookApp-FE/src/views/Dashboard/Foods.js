import React, { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import { Flex, Text, Box, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { usePaginator } from "chakra-paginator";
import FoodTable from "components/Tables/FoodTable";
import Paginator from "components/Tables/Paginator";
import { getFoods } from "apis/foods";
import { getUnits } from "apis/units";
import UnitTable from "components/Tables/UnitTable";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

function Foods() {
  const textColor = useColorModeValue("gray.700", "white");
  const [foods, setFoods] = useState({});
  const [foodloading, setFoodLoading] = useState(true);
  const [totalFoodPage, setTotalFoodPage] = useState(0);
  const [totalFood, setTotalFood] = useState(0);

  const [units, setUnits] = useState({});
  const [unitLoading, setUnitLoading] = useState(true);
  const [totalUnitPage, setTotalUnitPage] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);

  const {
    currentPage: currentFoodPage,
    setCurrentPage: setCurrentFoodPage,
    pageSize: foodPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  const {
    currentPage: currentUnitPage,
    setCurrentPage: setCurrentUnitPage,
    pageSize: unitPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchFoodData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    fetchUnitData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
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

  const fetchUnitData = (page, size) => {
    getUnits(page, size)
      .then((data) => {
        if (data.metadata.totalPage !== totalUnitPage)
          setTotalUnitPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalUnit)
          setTotalUnit(data.metadata.totalCount);
        const temp = { ...units };
        temp[page] = data.units;
        setUnits(temp);
        setUnitLoading(false);
      })
      .catch((err) => {
        setUnitLoading(true);
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

  const handleUnitPageChange = (nextPage) => {
    if (!units[nextPage] || units[nextPage].length !== unitPageSize) {
      if (nextPage === totalUnitPage) {
        if (units[nextPage]?.length === totalUnit % unitPageSize) {
          setCurrentUnitPage(nextPage);
          return;
        }
      }
      setUnitLoading(true);
      fetchUnitData(nextPage, unitPageSize);
    }
    setCurrentUnitPage(nextPage);
  };

  return (
    <Tabs isFitted variant="enclosed" pt={{ base: "120px", md: "75px" }}>
      <TabList mb="1rem">
        <Tab>Food</Tab>
        <Tab>Ingredient</Tab>
        <Tab>Unit</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
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
        </TabPanel>
        <TabPanel>
          <Box>ingredients</Box>
        </TabPanel>
        <TabPanel>
          <Flex direction="column" justifyContent="center" alignItems="center">
            {unitLoading ? (
              <Spinner />
            ) : (
              <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
                <CardHeader p="6px 0px 22px 0px">
                  <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Units Table
                  </Text>
                </CardHeader>
                <CardBody>
                  <UnitTable
                    units={units}
                    limit={unitPageSize}
                    curPage={currentUnitPage}
                  />
                </CardBody>
                <Flex mt="20px" justifyContent="end">
                  <Paginator
                    pagesQuantity={totalUnitPage}
                    currentPage={currentUnitPage}
                    onPageChange={handleUnitPageChange}
                  />
                </Flex>
              </Card>
            )}
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Foods;
