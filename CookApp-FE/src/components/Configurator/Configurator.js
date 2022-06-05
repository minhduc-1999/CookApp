// Chakra Imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Icon,
  Link,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import GitHubButton from "react-github-btn";
import { Separator } from "components/Separator/Separator";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { FaTwitter, FaFacebook } from "react-icons/fa";

export default function Configurator(props) {
  const { secondary, isOpen, onClose, fixed, ...rest } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const [switched, setSwitched] = useState(colorMode === "dark" ? false : true);
  // Chakra Color Mode
  let fixedDisplay = "flex";
  if (props.secondary) {
    fixedDisplay = "none";
  }

  let bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "white"
  );
  let colorButton = useColorModeValue("white", "gray.700");
  const secondaryButtonBg = useColorModeValue("white", "transparent");
  const secondaryButtonBorder = useColorModeValue("gray.700", "white");
  const secondaryButtonColor = useColorModeValue("gray.700", "white");
  const settingsRef = React.useRef();
  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        onClose={props.onClose}
        placement={document.documentElement.dir === "rtl" ? "left" : "right"}
        finalFocusRef={settingsRef}
        blockScrollOnMount={false}
      >
        <DrawerContent>
          <DrawerHeader pt="24px" px="24px">
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" mt="16px">
              Configurator
            </Text>
            <Separator />
          </DrawerHeader>
          <DrawerBody w="340px" ps="24px" pe="40px">
            <Flex flexDirection="column">
              <Box
                display={fixedDisplay}
                justifyContent="space-between "
                mb="16px"
              >
                <Text fontSize="md" fontWeight="600" mb="4px">
                  Dark mode
                </Text>
                <Switch
                  colorScheme="teal"
                  isChecked={switched}
                  onChange={() => {
                    toggleColorMode();
                    setSwitched(colorMode === "dark" ? false : true);
                  }}
                />
              </Box>
              <Separator />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
Configurator.propTypes = {
  secondary: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  fixed: PropTypes.bool,
};
