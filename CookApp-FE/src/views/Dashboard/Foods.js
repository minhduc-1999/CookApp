import React from "react";
// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import FoodRow from "components/Tables/FoodRow.js";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { foodData } from "variables/general";

function Foods() {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Tabs isFitted variant="enclosed" pt={{ base: "120px", md: "75px" }}>
      <TabList mb="1rem">
        <Tab>Food</Tab>
        <Tab>Ingredient</Tab>
        <Tab>Unit</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Flex direction="column">
            <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
              <CardHeader p="6px 0px 22px 0px">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                  Foods Table
                </Text>
              </CardHeader>
              <CardBody>
                <Table variant="simple" color={textColor}>
                  <Thead>
                    <Tr my=".8rem" pl="0px" color="gray.400">
                      <Th pl="0px" color="gray.400">
                        Index
                      </Th>
                      <Th color="gray.400">Name</Th>
                      <Th color="gray.400">Servings</Th>
                      <Th color="gray.400">Total Time</Th>
                      <Th color="gray.400">Created At</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {foodData.map((row, index) => {
                      return <FoodRow index={index} data={row} />;
                    })}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
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
