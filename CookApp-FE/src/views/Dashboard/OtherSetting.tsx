import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { FaPlus } from "react-icons/fa";
import randomColor from "randomcolor";
import { TopicResponse } from "apis/base.type";
import { useEffect, useState } from "react";
import { getTopics } from "apis/topics";
import Spinner from "components/Spinner";
import CreateTopicModal from "components/Modals/CreateTopicModal";
import { useAuth } from "contexts/Auth/Auth";

const INIT_TOPIC_PAGE_SIZE = 5;
const INIT_TOPIC_PAGE = 1;

function OtherSetting() {
  const [topics, setTopics] = useState<TopicResponse[]>([]);
  const textColor = useColorModeValue("gray.700", "white");
  const [nextTopicPage, setNextTopicPage] = useState(INIT_TOPIC_PAGE + 1);
  const [topicLoading, setTopicLoading] = useState(true);
  const [totalTopic, setTotalTopic] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refresh, setRefresh] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTopics(INIT_TOPIC_PAGE, INIT_TOPIC_PAGE_SIZE);
    setTopicLoading(true);
  }, [refresh]);

  const fetchTopics = async (
    page: number,
    size: number,
    isLoadMore = false
  ) => {
    try {
      const [topicItems, meta] = await getTopics(user?.accessToken, page, size);
      if (isLoadMore) setTopics([...topics, ...topicItems]);
      else setTopics(topicItems);
      setNextTopicPage(page + 1);
      setTotalTopic(meta.totalCount);
    } catch (err) {
      console.error(err);
    } finally {
      setTopicLoading(false);
    }
  };

  const onSeeMoreTopic = () => {
    fetchTopics(nextTopicPage, INIT_TOPIC_PAGE_SIZE, true);
    setTopicLoading(true);
  };
  return (
    <Flex pt={{ base: "120px", md: "75px" }} direction="column">
      <Card p="16px" my="24px">
        <CardHeader p="12px 5px" mb="12px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Topics
            </Text>
            <Text fontSize="sm" color="gray.500" fontWeight="400">
              Interest topic for user
            </Text>
          </Flex>
        </CardHeader>
        <CardBody px="5px">
          <VStack spacing="5" w="100%">
            <Grid
              templateColumns={{
                sm: "1fr",
                md: "repeat(3, 1fr)",
                xl: "repeat(6, 1fr)",
              }}
              gap="24px"
              w="100%"
            >
              <Button
                p="0px"
                bg="transparent"
                color="gray.500"
                border="1px solid lightgray"
                borderRadius="15px"
                minHeight={{ sm: "200px", md: "100%" }}
                onClick={onOpen}
              >
                <Flex direction="column" justifyContent="center" align="center">
                  <Icon as={FaPlus} fontSize="lg" mb="12px" />
                  <Text fontSize="lg" fontWeight="bold">
                    Create a New Topic
                  </Text>
                </Flex>
              </Button>
              {topics.map((topic, index) => (
                <Box
                  pt="100%"
                  borderRadius="15px"
                  backgroundColor={randomColor({
                    alpha: 0.5,
                    luminosity: "light",
                  })}
                  position="relative"
                  backgroundImage={topic?.cover?.url}
                  backgroundSize="cover"
                  key={index}
                >
                  <Flex
                    position="absolute"
                    zIndex={100}
                    w="100%"
                    h="100%"
                    justifyContent="center"
                    alignItems="center"
                    top={0}
                    left={0}
                  >
                    <Text
                      color="blackAlpha.800"
                      fontSize="3xl"
                      fontWeight="extrabold"
                    >
                      {topic.title}
                    </Text>
                  </Flex>
                </Box>
              ))}
            </Grid>
            {topicLoading ? <Spinner /> : null}
            <Button
              p="0px"
              bg="transparent"
              color="gray.500"
              border="1px solid lightgray"
              borderRadius="15px"
              onClick={onSeeMoreTopic}
              w="100%"
              display={topics.length < totalTopic ? "block" : "none"}
            >
              <Flex direction="column" justifyContent="center" align="center">
                <Text fontSize="lg" fontWeight="bold">
                  See more
                </Text>
              </Flex>
            </Button>
          </VStack>
        </CardBody>
      </Card>
      <CreateTopicModal
        isOpen={isOpen}
        onClose={onClose}
        saveCallback={() => {
          setRefresh(!refresh);
        }}
      />
    </Flex>
  );
}

export default OtherSetting;
