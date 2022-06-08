import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import SocialUserTab from "views/Tabs/SocialUserTabPanel";

function Users() {
  return (
    <Tabs isLazy isFitted variant="enclosed" pt={{ base: "120px", md: "75px" }}>
      <TabList mb="1rem">
        <Tab>User</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SocialUserTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Users;
