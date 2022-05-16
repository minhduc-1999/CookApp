import { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import {
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import UnitTable from "components/Tables/UnitTable";
import { getUnits } from "apis/units";
import { UnitResponse } from "apis/base.type";
import { FaPlus } from "react-icons/fa";
import CreateUnitModal from "components/Modals/CreateUnitModal";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const UnitTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");

  const [units, setUnits] = useState<{
    [key: number]: UnitResponse[];
  }>({});
  const [unitLoading, setUnitLoading] = useState(true);
  const [totalUnitPage, setTotalUnitPage] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    currentPage: currentUnitPage,
    setCurrentPage: setCurrentUnitPage,
    pageSize: unitPageSize,
  } = usePaginator({
    initialState: { currentPage: INIT_CUR_PAGE, pageSize: INIT_PAGE_SIZE },
  });

  useEffect(() => {
    fetchUnitData(INIT_CUR_PAGE, INIT_PAGE_SIZE);
  }, []);

  const fetchUnitData = (page: number, size: number) => {
    getUnits(page, size)
      .then((data) => {
        const [unitResult, metadata] = data;
        if (metadata.totalPage !== totalUnitPage)
          setTotalUnitPage(metadata.totalPage);
        if (metadata.totalCount !== totalUnit)
          setTotalUnit(metadata.totalCount);
        const temp = { ...units };
        temp[page] = unitResult;
        setUnits(temp);
        setUnitLoading(false);
      })
      .catch((err) => {
        setUnitLoading(true);
        console.error(err);
      });
  };

  const handleUnitPageChange = (nextPage: number) => {
    const unitList = units[nextPage];
    if (!unitList || unitList.length !== unitPageSize) {
      if (nextPage === totalUnitPage) {
        if (unitList?.length === totalUnit % unitPageSize) {
          setCurrentUnitPage(nextPage);
          return;
        }
      }
      setUnitLoading(true);
      fetchUnitData(nextPage, unitPageSize);
    }
    setCurrentUnitPage(nextPage);
  };

  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      {unitLoading ? (
        <Spinner />
      ) : (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px" justifyContent="space-between">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Units Table
            </Text>
            <HStack spacing="10px">
              <Button
                leftIcon={<FaPlus />}
                variant="ghost"
                colorScheme="teal"
                onClick={onOpen}
              >
                Add unit
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <UnitTable
              units={units}
              limit={unitPageSize}
              curPage={currentUnitPage}
            />
          </CardBody>
          <Flex mt="20px" justifyContent="end">
            <Paginator
              pagesQuantity={totalUnitPage}
              currentPage={currentUnitPage}
              onPageChange={handleUnitPageChange}
            />
          </Flex>
        </Card>
      )}
      <CreateUnitModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default UnitTabPanel;
