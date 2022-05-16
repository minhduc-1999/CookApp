import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import FoodTab from "../Tabs/FoodTabPanel";
import UnitTab from "../Tabs/UnitTabPanel";
import IngredientTab from "../Tabs/IngredientTabPanel";

function Foods() {
  return (
    <Tabs isLazy isFitted variant="enclosed" pt={{ base: "120px", md: "75px" }}>
      <TabList mb="1rem">
        <Tab>Food</Tab>
        <Tab>Ingredient</Tab>
        <Tab>Unit</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <FoodTab />
        </TabPanel>
        <TabPanel>
          <IngredientTab />
        </TabPanel>
        <TabPanel>
          <UnitTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Foods;
