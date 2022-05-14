import { useState, useEffect } from "react";
import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import { getIngredients } from "apis/ingredients";
import { IngredientResponse } from "apis/base.type";
import Card from "components/Card/Card";
import IngredientTable from "components/Tables/IngredientTable";
import CardHeader from "components/Card/CardHeader";
import Paginator from "components/Tables/Paginator";
import Spinner from "components/Spinner";
import { FaPlus } from "react-icons/fa";
import CreateIngredientModal from "components/Modals/CreateIngredientModal";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const IngredientTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const [ingredients, setIngredients] = useState<{
    [key: number]: IngredientResponse[];
  }>({});
  const [ingredientLoading, setIngredientLoading] = useState(true);
  const [totalIngredientPage, setTotalIngredientPage] = useState(0);
  const [totalIngredient, setTotalIngredient] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const fetchIngredientData = (page: number, size: number) => {
    getIngredients(page, size)
      .then((data) => {
        const [listResult, meta] = data;
        if (meta.totalPage !== totalIngredientPage)
          setTotalIngredientPage(meta.totalPage);
        if (meta.totalCount !== totalIngredient)
          setTotalIngredient(meta.totalCount);
        const temp = { ...ingredients };
        temp[page] = listResult;
        setIngredients(temp);
        setIngredientLoading(false);
      })
      .catch((err) => {
        setIngredientLoading(true);
        console.error(err);
      });
  };

  const handleIngredientPageChange = (nextPage: number) => {
    const ingredientList = ingredients[nextPage];
    if (!ingredientList || ingredientList.length !== ingredientPageSize) {
      if (nextPage === totalIngredientPage) {
        if (ingredientList?.length === totalIngredient % ingredientPageSize) {
          setCurrentIngredientPage(nextPage);
          return;
        }
      }
      setIngredientLoading(true);
      fetchIngredientData(nextPage, ingredientPageSize);
    }
    setCurrentIngredientPage(nextPage);
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      {ingredientLoading ? (
        <Spinner />
      ) : (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px" justifyContent="space-between">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Ingredients Table
            </Text>
            <HStack spacing="10px">
              <Button
                leftIcon={<FaPlus />}
                variant="ghost"
                colorScheme="teal"
                onClick={onOpen}
              >
                Add ingredient
              </Button>
            </HStack>
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
      <CreateIngredientModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default IngredientTabPanel;
