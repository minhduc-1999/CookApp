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
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RequestResponse, RequestStatus } from "apis/base.type";
import { confirmRequest, getWaitingRequest } from "apis/requests";
import Card from "components/Card/Card";
import Certificate from "components/Certificates";
import Spinner from "components/Spinner";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";
import { calendarTime } from "utils/time";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;
const INIT_TOTAL_PAGE = 1;
const TRIGGER_LOAD_MORE_OFFSET = 2; /*trigger when distance < OFFSET * window.innerHeight*/

function RequestCensorship() {
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [totalRequestPage, setTotalRequestPage] = useState(INIT_TOTAL_PAGE);
  const [totalRequest, setTotalRequest] = useState(0);
  const [curPage, setCurPage] = useState(0);
  const toast = useToast();
  const requestListRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequestData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
    setRequestLoading(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const bound = requestListRef?.current?.getBoundingClientRect();
      if (
        bound?.bottom &&
        bound.bottom < TRIGGER_LOAD_MORE_OFFSET * window.innerHeight
      ) {
        if (!requestLoading) {
          fetchRequestData(curPage + 1, INIT_PAGE_SIZE);
        }
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  });

  const fetchRequestData = (page: number, size: number) => {
    if (page === curPage || page > totalRequestPage) return;
    getWaitingRequest(user?.accessToken, page, size)
      .then((data) => {
        const [requestResList, metadata] = data;
        if (metadata?.page) setCurPage(metadata.page);
        if (metadata?.totalPage && metadata.totalPage !== totalRequestPage)
          setTotalRequestPage(metadata.totalPage);
        if (metadata?.totalCount && metadata.totalCount !== totalRequest)
          setTotalRequest(metadata.totalCount);
        setRequests([...requests, ...requestResList]);
        setRequestLoading(false);
      })
      .catch((err) => {
        setRequestLoading(true);
        console.error(err);
      });
  };
  const onConfirmRequest = (requestId: string, status: RequestStatus) => {
    confirmRequest(requestId, { status }, user?.accessToken)
      .then(() => {
        const temp = requests.filter((request) => request.id !== requestId);
        setRequests(temp);
        setTotalRequest(totalRequest - 1);
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
        ref={requestListRef}
        w={1000}
      >
        {requests?.map((request, index) => {
          return (
            <Card key={index}>
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
                      <Text fontWeight="bold">
                        {request.sender?.displayName}
                      </Text>
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
                    onConfirmRequest(request?.id, RequestStatus.CONFIRMED);
                  }}
                  colorScheme="teal"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => {
                    onConfirmRequest(request?.id, RequestStatus.REJECTED);
                  }}
                >
                  Dismiss
                </Button>
              </Grid>
            </Card>
          );
        })}
        {requestLoading ? (
          <Spinner />
        ) : requests?.length === 0 ? (
          <Text fontSize={"2xl"} textAlign="center" color={"gray"}>
            There are no request <br />
            need to be confirmed
          </Text>
        ) : null}
      </Flex>
    </Flex>
  );
}

export default RequestCensorship;
