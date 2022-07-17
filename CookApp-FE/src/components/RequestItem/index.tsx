import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Button,
  Flex,
  FormControl,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RequestResponse, RequestStatus } from "apis/base.type";
import { confirmRequest } from "apis/requests";
import Card from "components/Card/Card";
import Certificate from "components/Certificates";
import { useAuth } from "contexts/Auth/Auth";
import { useRef, useState } from "react";
import { calendarTime } from "utils/time";

type Props = {
  request: RequestResponse;
  reloadCallback: (requestId: string) => void;
};

export const RequestItem = ({ request, reloadCallback }: Props) => {
  const toast = useToast();
  const { user } = useAuth();
  const initialRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirmRequest = (status: RequestStatus, note?: string) => {
    setSaving(true);
    confirmRequest(request.id, { status, note }, user?.accessToken)
      .then(() => {
        reloadCallback(request.id);
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
      })
      .finally(() => {
        setSaving(false);
        onClose()
      });
  };
  return (
    <Card>
      <Flex direction="column">
        <Flex
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            direction="row"
            marginBottom={4}
            justifyContent="start"
            alignItems="center"
            gap={3}
          >
            <Avatar
              name={request.sender?.displayName}
              src={request.sender?.avatar?.url}
            />
            <VStack>
              <Text fontWeight="bold">{request.sender?.displayName}</Text>
            </VStack>
          </Flex>
          <Text justifySelf="end">
            <b>Requested at: </b>
            {calendarTime(request.createdAt)}
          </Text>
        </Flex>

        <Accordion mt={5} allowToggle w="100%">
          <AccordionItem borderBottom="none">
            <AccordionButton px={0}>
              <Flex
                direction={"row"}
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>Certificates</Text>
                <AccordionIcon />
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {request?.certificates?.map((cert, index) => {
                return <Certificate key={index} cert={cert} />;
              })}
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
            onConfirmRequest(RequestStatus.CONFIRMED);
          }}
          colorScheme="teal"
        >
          Confirm
        </Button>
        <Button onClick={onOpen}>Dismiss</Button>
      </Grid>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter rejection reason</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <Textarea id="note" ref={initialRef} placeholder="Note" />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            {saving ? (
              <Button
                isLoading
                loadingText="Saving"
                colorScheme="teal"
                variant="outline"
              />
            ) : (
              <Button
                colorScheme="teal"
                onClick={() => {
                  onConfirmRequest(
                    RequestStatus.REJECTED,
                    initialRef?.current?.value
                  );
                }}
              >
                OK
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};
