import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import SocialUserTab from "views/Tabs/SocialUserTabPanel";

function Users() {
  return (
    <Tabs isLazy isFitted variant="enclosed" pt={{ base: "120px", md: "75px" }}>
      <TabList mb="1rem">
        <Tab>Social User</Tab>
        <Tab>System User</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SocialUserTab />
        </TabPanel>
        <TabPanel>System user</TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default Users;
