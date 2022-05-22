import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FoodResponse } from "apis/base.type";
import { getFoodDetail } from "apis/foods";
import { RatingIcon, ServingIcon, TotalTimeIcon } from "components/Icons/Icons";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";

type FoodDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  foodId: string;
};

const FoodDetailModal = ({ isOpen, onClose, foodId }: FoodDetailModalProps) => {
  const [food, setFood] = useState<FoodResponse>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFoodDetail(foodId).then((res) => {
      setFood(res);
      setLoading(false);
    });
  }, [foodId]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody pb={2} mt={10}>
          {loading ? (
            <Spinner />
          ) : (
            <>
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
                        __css={{whiteSpace: "normal"}}
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
                                  <Text __css={{wordWrap: "break-word"}}>
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
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FoodDetailModal;
