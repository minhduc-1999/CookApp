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

const PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

function Foods() {
  const textColor = useColorModeValue("gray.700", "white");
  const [foods, setFoods] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [totalFood, setTotalFood] = useState(0);

  const { currentPage, setCurrentPage, pageSize } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: PAGE_SIZE },
  });

  useEffect(() => {
    fetchData(INIT_CUR_PAGE);
  }, []);

  const fetchData = (page) => {
    getFoods(page, pageSize)
      .then((data) => {
        if (data.metadata.totalPage !== totalPage)
          setTotalPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalFood)
          setTotalFood(data.metadata.totalCount);
        const temp = { ...foods };
        temp[page] = data.foods;
        setFoods(temp);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        console.error(err);
      });
  };

  const handlePageChange = (nextPage) => {
    if (!foods[nextPage] || foods[nextPage].length !== pageSize) {
      if (nextPage === totalPage) {
        if (foods[nextPage]?.length === totalFood % pageSize) {
          setCurrentPage(nextPage);
          return;
        }
      }
      setLoading(true);
      fetchData(nextPage);
    }
    setCurrentPage(nextPage);
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
            {loading ? (
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
                    limit={pageSize}
                    curPage={currentPage}
                  />
                </CardBody>
                <Flex mt="20px" justifyContent="end">
                  <Paginator
                    pagesQuantity={totalPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
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
          <Box>Unit</Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Foods;
