import {
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CertificateResponse, CertificateStatus } from "apis/base.type";
import { confirmCert } from "apis/requests";
import CertificateStatusTag from "components/Tags/CertificateStatusTag";
import { useAuth } from "contexts/Auth/Auth";
import { useRef, useState } from "react";
import { calendarTime } from "utils/time";

type Props = {
  key?: number;
  cert: CertificateResponse;
};

const Certificate = (props: Props) => {
  const { cert: propCert, key } = props;
  const [cert, setCert] = useState<CertificateResponse>(propCert);
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
  const initialRef = useRef<HTMLTextAreaElement>(null);
  const [saving, setSaving] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onConfirmCert = (status: CertificateStatus, note?: string) => {
    setSaving(true);
    confirmCert(cert.id, { status, note }, user?.accessToken)
      .then(() => {
        setCert({
          ...cert,
          status,
        });
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
    <Flex
      key={key}
      direction="column"
      border="2px"
      borderColor="teal.300"
      borderRadius="xl"
      padding="5"
      my={5}
    >
      <Grid
        templateRows="repeat(1, 1fr)"
        templateColumns="repeat(2, 1fr)"
        gap={4}
      >
        <GridItem>
          <Flex
            w="100%"
            h="100%"
            justifyContent={"center"}
            alignItems="center"
            paddingX={2}
          >
            <Image
              src={cert.image.url ?? ""}
              alt={`${cert?.title}'s image`}
              objectFit="contain"
              borderRadius={3}
              maxH={200}
              cursor="zoom-in"
              onClick={onImageOpen}
            />
            <Modal isOpen={isImageOpen} onClose={onImageClose} size="6xl">
              <ModalOverlay />
              <ModalContent minH={"20"}>
                <ModalCloseButton color={"teal.300"} />
                <Image
                  src={cert.image.url ?? ""}
                  alt={`${cert?.title}'s image`}
                  objectFit="contain"
                  borderRadius={3}
                />
              </ModalContent>
            </Modal>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex direction="column" alignItems="start">
            <Text fontWeight="bold" fontSize="3xl">
              {cert?.title} <CertificateStatusTag status={cert.status} />
            </Text>
            <Text my={1}>
              <b>Number: </b>
              {cert?.number}
            </Text>
            <Text my={1}>
              <b>Issue by: </b>
              {cert?.issueBy}
            </Text>
            <Text my={1}>
              <b>Issue at: </b>
              {calendarTime(cert.issueAt)}
            </Text>
            <Text my={1}>
              <b>Expire at: </b>
              {calendarTime(cert.expireAt)}
            </Text>
          </Flex>
        </GridItem>
      </Grid>
      {cert.status === CertificateStatus.WAITING && (
        <Grid
          mt={4}
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(2, 1fr)"
          gap={6}
        >
          <Button
            onClick={() => {
              onConfirmCert(CertificateStatus.CONFIRMED);
            }}
            colorScheme="teal"
          >
            Confirm
          </Button>
          <Button
            onClick={onOpen}
          >
            Dismiss
          </Button>
        </Grid>
      )}
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
                  onConfirmCert(
                    CertificateStatus.REJECTED,
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
    </Flex>
  );
};
export default Certificate;
