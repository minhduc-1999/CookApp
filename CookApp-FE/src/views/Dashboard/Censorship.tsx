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
  VStack,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import { getUncensoredFood } from "apis/foods";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import { RatingIcon, ServingIcon, TotalTimeIcon } from "components/Icons/Icons";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

function Censorship() {
  const [foods, setFoods] = useState<FoodResponse[]>([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [totalFoodPage, setTotalFoodPage] = useState(0);
  const [totalFood, setTotalFood] = useState(0);

  useEffect(() => {
    fetchFoodData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    setFoodLoading(true);
  }, []);

  const fetchFoodData = (page: number, size: number) => {
    getUncensoredFood(page, size)
      .then((data) => {
        const [foodResList, metadata] = data;
        if (metadata.totalPage !== totalFoodPage)
          setTotalFoodPage(metadata.totalPage);
        if (metadata.totalCount !== totalFood)
          setTotalFood(metadata.totalCount);
        setFoods([...foods, ...foodResList]);
        setFoodLoading(false);
      })
      .catch((err) => {
        setFoodLoading(true);
        console.error(err);
      });
  };
  return (
    <Flex pt={{ base: "120px", md: "75px" }} justifyContent="center">
      {foodLoading ? (
        <Spinner />
      ) : (
        <Flex
          direction="column"
          gap={12}
          justifyContent="center"
          alignItems="center"
        >
          {foods?.map((food) => {
            return (
              <Card maxW={800}>
                <CardBody>
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
                            <Table
                              size="sm"
                              variant="striped"
                              colorScheme="teal"
                            >
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
                                        <Text
                                          __css={{ wordWrap: "break-word" }}
                                        >
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
                </CardBody>
                <Grid
                  mt={4}
                  templateRows="repeat(1, 1fr)"
                  templateColumns="repeat(2, 1fr)"
                  gap={6}
                >
                  <Button colorScheme="teal">Confirm</Button>
                  <Button>Dismiss</Button>
                </Grid>
              </Card>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}

export default Censorship;
