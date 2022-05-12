import React, { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import IngredientTable from "components/Tables/IngredientTable";
import { getIngredients } from "apis/ingredients";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const IngredientTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");

  const [ingredients, setIngredients] = useState({});
  const [ingredientLoading, setIngredientLoading] = useState(true);
  const [totalIngredientPage, setTotalIngredientPage] = useState(0);
  const [totalIngredient, setTotalIngredient] = useState(0);

  const {
    currentPage: currentIngredientPage,
    setCurrentPage: setCurrentIngredientPage,
    pageSize: ingredientPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchIngredientData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
  }, []);

  const fetchIngredientData = (page, size) => {
    getIngredients(page, size)
      .then((data) => {
        if (data.metadata.totalPage !== totalIngredientPage)
          setTotalIngredientPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalIngredient)
          setTotalIngredient(data.metadata.totalCount);
        const temp = { ...ingredients };
        temp[page] = data.ingredients;
        setIngredients(temp);
        setIngredientLoading(false);
      })
      .catch((err) => {
        setIngredientLoading(true);
        console.error(err);
      });
  };

  const handleIngredientPageChange = (nextPage) => {
    if (!ingredientss[nextPage] || foods[nextPage].length !== foodPageSize) {
      if (nextPage === totalIngredientPage) {
        if (ingredientss[nextPage]?.length === totalIngredient % foodPageSize) {
          setCurrentIngredientPage(nextPage);
          return;
        }
      }
      setIngredientLoading(true);
      fetchIngredientData(nextPage, ingredientsPageSize);
    }
    setCurrentIngredientPage(nextPage);
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      {ingredientLoading ? (
        <Spinner />
      ) : (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Ingredients Table
            </Text>
          </CardHeader>
          <CardBody>
            <IngredientTable
              ingredients={ingredients}
              limit={ingredientPageSize}
              curPage={currentIngredientPage}
            />
          </CardBody>
          <Flex mt="20px" justifyContent="end">
            <Paginator
              pagesQuantity={totalIngredientPage}
              currentPage={currentIngredientPage}
              onPageChange={handleIngredientPageChange}
            />
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export default IngredientTabPanel;
