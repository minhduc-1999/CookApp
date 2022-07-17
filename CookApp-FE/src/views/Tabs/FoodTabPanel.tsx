import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import { deleteFood, getFoods } from "apis/foods";
import { usePaginator } from "chakra-paginator";
import DelelteAlertDialog from "components/Alert/DeleteAlertDialog";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CreateFoodModal from "components/Modals/CreateFoodModal";
import Spinner from "components/Spinner";
import FoodTable from "components/Tables/FoodTable";
import Paginator from "components/Tables/Paginator";
import { useAuth } from "contexts/Auth/Auth";
import React from "react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

type TabContextType = {
  onRemoveTrigger: (id: string) => void;
};
export const FoodTabContext = React.createContext<TabContextType | undefined>(
  undefined
);

const FoodTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [foods, setFoods] = useState<{
    [key: number]: FoodResponse[];
  }>({});
  const [foodloading, setFoodLoading] = useState(false);
  const [totalFoodPage, setTotalFoodPage] = useState(0);
  const [totalFood, setTotalFood] = useState(0);
  const { user } = useAuth();

  const {
    currentPage: currentFoodPage,
    setCurrentPage: setCurrentFoodPage,
    pageSize: foodPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    fetchFoodData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    setFoodLoading(true);
  }, []);

  const fetchFoodData = (
    page: number,
    size: number,
    removeFollowingPage = false
  ) => {
    getFoods(user?.accessToken, page, size)
      .then((data) => {
        const [foodResList, metadata] = data;
        if (metadata.totalPage !== totalFoodPage)
          setTotalFoodPage(metadata.totalPage);
        if (metadata.totalCount !== totalFood)
          setTotalFood(metadata.totalCount);
        const temp = { ...foods };
        temp[page] = foodResList;
        if (removeFollowingPage) {
          let iterator = 1;
          while (iterator <= totalFoodPage) {
            if (iterator !== page) temp[iterator] = [];
            iterator++;
          }
        }
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
        const remain = totalFood - (totalFoodPage - 1) * foodPageSize;
        if (foodList?.length === remain) {
          setCurrentFoodPage(nextPage);
          return;
        }
      }
      setFoodLoading(true);
      fetchFoodData(nextPage, foodPageSize);
    }
    setCurrentFoodPage(nextPage);
  };

  const reloadFromPage = (page: number) => {
    setFoodLoading(true);
    fetchFoodData(page, INIT_PAGE_SIZE, true);
  };

  const onDeleteFood = async () => {
    if (deleteId === "") throw new Error("Some thing went wrong");
    return deleteFood(deleteId, user?.accessToken)
      .then(() => {
        setDeleteId("");
        reloadFromPage(currentFoodPage);
      })
      .catch((err: Error) => {
        throw err;
      });
  };

  const onRemoveTrigger = (id: string) => {
    onModalOpen();
    setDeleteId(id);
  };

  return (
    <FoodTabContext.Provider value={{ onRemoveTrigger }}>
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
                  leftIcon={<FaPlus />}
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
        <CreateFoodModal
          isOpen={isOpen}
          onClose={onClose}
          onSaveCb={() => {
            setFoodLoading(true);
            fetchFoodData(currentFoodPage, foodPageSize, true);
          }}
        />
        <DelelteAlertDialog
          title="Delete food"
          isOpen={isModalOpen}
          onClose={onModalClose}
          onDelete={onDeleteFood}
        />
      </Flex>
    </FoodTabContext.Provider>
  );
};

export default FoodTabPanel;
