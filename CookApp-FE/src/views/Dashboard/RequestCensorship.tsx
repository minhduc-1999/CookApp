import { Flex, Text } from "@chakra-ui/react";
import { RequestResponse } from "apis/base.type";
import { getWaitingRequest } from "apis/requests";
import { RequestItem } from "components/RequestItem";
import Spinner from "components/Spinner";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";

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

  const reloadCallback = (requestId: string) => {
    const temp = requests.filter((request) => request.id !== requestId);
    setRequests(temp);
    setTotalRequest(totalRequest - 1);
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
            <RequestItem
              request={request}
              reloadCallback={reloadCallback}
              key={index}
            />
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
