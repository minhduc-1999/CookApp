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
import {
  CertificateStatus,
  RequestResponse,
  RequestStatus,
  RequestType,
} from "apis/base.type";
import { confirmRequest } from "apis/requests";
import Card from "components/Card/Card";
import Certificate from "components/Certificates";
import Spinner from "components/Spinner";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";

const dump: RequestResponse[] = [
  {
    createdAt: 1657045952940,
    id: "9b4d8da2-761b-44ff-9eb3-6a477de78c7f",
    updatedAt: 1657045952940,
    status: RequestStatus.WAITING,
    type: RequestType.REQUEST_TO_BE_NUTRITIONIST,
    sender: {
      id: "08259bc3-aaab-4d6f-b739-e23763bd3663",
      avatar: {
        type: "IMAGE",
        url: "url",
      },
      displayName: "log_pink.4692",
    },
    certificates: [
      {
        createdAt: 1657045952940,
        id: "94eaed66-3213-4636-8208-bc5e1e5e5822",
        updatedAt: 1657131774979,
        issueBy: "string",
        issueAt: "2022-07-05T16:23:47.174Z",
        title: "string",
        expireAt: "2022-07-05T17:09:25.000Z",
        image: {
          url:
            "https://scontent.fsgn13-2.fna.fbcdn.net/v/t39.30808-6/292220529_5802841936412304_2120385792329340650_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5cd70e&_nc_ohc=zhc-oEp_sG0AX_9-vRM&_nc_ht=scontent.fsgn13-2.fna&oh=00_AT8Ze5IevzoQSzFUyXk1zcW1fuSLNaDW1PwXzn6ZJAgTlQ&oe=62CCC7F5",
          type: "IMAGE",
        },
        status: CertificateStatus.WAITING,
        note: "string",
        number: "2",
      },
      {
        createdAt: 1657045952940,
        id: "94eaed66-3213-4636-8208-bc5e1e5e5822",
        updatedAt: 1657131774979,
        issueBy: "string",
        issueAt: "2022-07-05T16:23:47.174Z",
        title: "string",
        expireAt: "2022-07-05T17:09:25.000Z",
        image: {
          url:
            "https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.30808-6/291409156_1127713897859347_7003114826207667397_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=H0jrXyf2Gb0AX-OjcbZ&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT8DmOTsKCSiLU59h0VSm4Qh_xZ2Gm07JB20KGw5f0LOKA&oe=62CAFC78",
          type: "IMAGE",
        },
        status: CertificateStatus.REJECTED,
        note: "string",
        number: "2",
      },
      {
        createdAt: 1657045952940,
        id: "94eaed66-3213-4636-8208-bc5e1e5e5822",
        updatedAt: 1657131774979,
        issueBy: "string",
        issueAt: "2022-07-05T16:23:47.174Z",
        title: "string",
        expireAt: "2022-07-05T17:09:25.000Z",
        image: {
          url:
            "https://scontent.fsgn13-1.fna.fbcdn.net/v/t39.30808-6/291409156_1127713897859347_7003114826207667397_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=H0jrXyf2Gb0AX-OjcbZ&_nc_ht=scontent.fsgn13-1.fna&oh=00_AT8DmOTsKCSiLU59h0VSm4Qh_xZ2Gm07JB20KGw5f0LOKA&oe=62CAFC78",
          type: "IMAGE",
        },
        status: CertificateStatus.CONFIRMED,
        note: "string",
        number: "2",
      },
    ],
  },
];

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
    setRequestLoading(true);
    setCurPage(1);
    setRequests(dump);
    setTotalRequestPage(1);
    setTotalRequest(1);
    setRequestLoading(false);
    // getWaitingRequest(user?.accessToken, page, size)
    //   .then((data) => {
    //     const [requestResList, metadata] = data;
    //     if (metadata?.page) setCurPage(metadata.page);
    //     if (metadata?.totalPage && metadata.totalPage !== totalRequestPage)
    //       setTotalRequestPage(metadata.totalPage);
    //     if (metadata?.totalCount && metadata.totalCount !== totalRequest)
    //       setTotalRequest(metadata.totalCount);
    //     setRequests([...requests, ...requestResList]);
    //     setRequestLoading(false);
    //   })
    //   .catch((err) => {
    //     setRequestLoading(true);
    //     console.error(err);
    //   });
  };
  const onRejectRequest = (requestId: string) => {
    confirmRequest(requestId, RequestStatus.REJECTED, user?.accessToken)
      .then(() => {
        const temp = requests.filter((request) => request.id !== requestId);
        setRequests(temp);
        setTotalRequest(totalRequest - 1);
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
      });
  };
  const onConfirmRequest = (requestId: string) => {
    confirmRequest(requestId, RequestStatus.CONFIRMED, user?.accessToken)
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
                  direction="row"
                  marginBottom={4}
                  justifyContent="start"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar
                    name={request.sender?.displayName}
                    src={request.sender?.avatar?.url}
                  />
                  <VStack>
                    <Text fontWeight="bold">{request.sender?.displayName}</Text>
                  </VStack>
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
                    onConfirmRequest(request?.id);
                  }}
                  colorScheme="teal"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => {
                    onRejectRequest(request?.id);
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
