import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import { confirmFood, getUncensoredFood } from "apis/foods";
import Card from "components/Card/Card";
import { RatingIcon, ServingIcon, TotalTimeIcon } from "components/Icons/Icons";
import Spinner from "components/Spinner";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;
const INIT_TOTAL_PAGE = 1;
const TRIGGER_LOAD_MORE_OFFSET = 2; /*trigger when distance < OFFSET * window.innerHeight*/

function RequestCensorship() {
  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [totalFoodPage, setTotalFoodPage] = useState(INIT_TOTAL_PAGE);
  const [totalFood, setTotalFood] = useState(0);
  const [curPage, setCurPage] = useState(0);
  const toast = useToast();
  const foodListRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFoodData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const bound = foodListRef?.current?.getBoundingClientRect();
      if (
        bound?.bottom &&
        bound.bottom < TRIGGER_LOAD_MORE_OFFSET * window.innerHeight
      ) {
        if (!foodLoading) {
          fetchFoodData(curPage + 1, INIT_PAGE_SIZE);
        }
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  });

  const fetchFoodData = (page: number, size: number) => {
    if (page === curPage || page > totalFoodPage) return;
    setFoodLoading(true);
    getUncensoredFood(user?.accessToken, page, size)
      .then((data) => {
        const [foodResList, metadata] = data;
        if (metadata?.page) setCurPage(metadata.page);
        if (metadata?.totalPage && metadata.totalPage !== totalFoodPage)
          setTotalFoodPage(metadata.totalPage);
        if (metadata?.totalCount && metadata.totalCount !== totalFood)
          setTotalFood(metadata.totalCount);
        setFoods([...foods, ...foodResList]);
        setFoodLoading(false);
      })
      .catch((err) => {
        setFoodLoading(true);
        console.error(err);
      });
  };
  const onDismissed = (foodId: string) => {
    confirmFood(foodId, "dismissed", user?.accessToken)
      .then(() => {
        const temp = foods.filter((food) => food.id !== foodId);
        setFoods(temp);
        setTotalFood(totalFood - 1);
        toast({
          title: "Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };
  const onConfirmFood = (foodId: string) => {
    confirmFood(foodId, "confirmed", user?.accessToken)
      .then(() => {
        const temp = foods.filter((food) => food.id !== foodId);
        setFoods(temp);
        setTotalFood(totalFood - 1);
        toast({
          title: "Confirm successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((err: Error) => {
        toast({
          title: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
  };
  return (
    <Flex pt={{ base: "120px", md: "75px" }} justifyContent="center">
      <Flex
        direction="column"
        gap={8}
        justifyContent="center"
        alignItems="center"
        ref={foodListRef}
      >
        {foods?.map((food, index) => {
          return (
            <Card maxW={800} key={index}>
              <Flex direction="column">
                <Flex
                  direction="row"
                  marginBottom={4}
                  justifyContent="start"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar
                    name={food.author?.displayName}
                    src={food.author?.avatar?.url}
                  />
                  <VStack>
                    <Text fontWeight="bold">{food.author.displayName}</Text>
                  </VStack>
                </Flex>
                <Grid
                  templateRows="repeat(1, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap={4}
                >
                  <GridItem>
                    <Image
                      src={food?.photos ? food?.photos[0]?.url ?? "" : ""}
                      alt={`${food?.name}'s image`}
                      objectFit="contain"
                      borderRadius={3}
                    />
                  </GridItem>
                  <GridItem>
                    <Flex direction="column" alignItems="start">
                      <Text fontWeight="bold" fontSize="3xl">
                        {food?.name}
                      </Text>
                      <Text my={4}>{food?.description}</Text>
                      <Flex
                        direction="row"
                        w="100%"
                        justifyContent="start"
                        columnGap={12}
                      >
                        <Flex alignItems="center" justifyContent="center">
                          <ServingIcon />
                          <Text ml={1}>{food?.servings}</Text>
                        </Flex>
                        <Flex alignItems="center" justifyContent="center">
                          <TotalTimeIcon />
                          <Text ml={1}>{food?.totalTime}m</Text>
                        </Flex>
                        {food?.rating && (
                          <Flex alignItems="center" justifyContent="center">
                            <RatingIcon />
                            <Text ml={1}>{food?.rating}/5</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                  </GridItem>
                </Grid>

                <Accordion mt={5} allowToggle w="100%">
                  <AccordionItem borderTop={"none"}>
                    <AccordionButton px={0}>
                      <Flex
                        direction={"row"}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text>Ingredients</Text>
                        <AccordionIcon />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <TableContainer>
                        <Table size="sm" variant="striped" colorScheme="teal">
                          <Thead>
                            <Tr>
                              <Th>Name</Th>
                              <Th>Unit</Th>
                              <Th isNumeric>Quantity</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {food?.ingredients?.map((ingre) => {
                              return (
                                <Tr>
                                  <Td>{ingre.name}</Td>
                                  <Td>{ingre.unit}</Td>
                                  <Td isNumeric>{ingre.quantity}</Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem borderBottom="none">
                    <AccordionButton px={0}>
                      <Flex
                        direction={"row"}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Text>Steps</Text>
                        <AccordionIcon />
                      </Flex>
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <TableContainer>
                        <Table
                          size="sm"
                          variant="striped"
                          colorScheme="teal"
                          w="100%"
                          __css={{ whiteSpace: "normal" }}
                        >
                          <Thead>
                            <Tr>
                              <Th>Step</Th>
                              <Th>Description</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {food?.steps?.map((step, index) => {
                              return (
                                <Tr>
                                  <Td>{index + 1}</Td>
                                  <Td>
                                    <Text __css={{ wordWrap: "break-word" }}>
                                      {step.content}
                                    </Text>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Flex>
              <Grid
                mt={4}
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(2, 1fr)"
                gap={6}
              >
                <Button
                  onClick={() => {
                    onConfirmFood(food?.id);
                  }}
                  colorScheme="teal"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => {
                    onDismissed(food?.id);
                  }}
                >
                  Dismiss
                </Button>
              </Grid>
            </Card>
          );
        })}
        {foodLoading ? (
          <Spinner />
        ) : foods?.length === 0 ? (
          <Text fontSize={"2xl"} textAlign="center" color={"gray"}>
            There are no food <br />
            need to be confirmed
          </Text>
        ) : null}
      </Flex>
    </Flex>
  );
}

export default RequestCensorship;
