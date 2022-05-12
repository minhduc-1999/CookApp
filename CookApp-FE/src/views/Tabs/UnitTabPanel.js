import React, { useState, useEffect } from "react";
import Spinner from "components/Spinner";
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { usePaginator } from "chakra-paginator";
import Paginator from "components/Tables/Paginator";
import UnitTable from "components/Tables/UnitTable";
import { getUnits } from "apis/units";

const INIT_PAGE_SIZE = 10;
const INIT_CUR_PAGE = 1;

const UnitTabPanel = () => {
  const textColor = useColorModeValue("gray.700", "white");

  const [units, setUnits] = useState({});
  const [unitLoading, setUnitLoading] = useState(true);
  const [totalUnitPage, setTotalUnitPage] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);

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

  const fetchUnitData = (page, size) => {
    getUnits(page, size)
      .then((data) => {
        if (data.metadata.totalPage !== totalUnitPage)
          setTotalUnitPage(data.metadata.totalPage);
        if (data.metadata.totalCount !== totalUnit)
          setTotalUnit(data.metadata.totalCount);
        const temp = { ...units };
        temp[page] = data.units;
        setUnits(temp);
        setUnitLoading(false);
      })
      .catch((err) => {
        setUnitLoading(true);
        console.error(err);
      });
  };

  const handleUnitPageChange = (nextPage) => {
    if (!units[nextPage] || units[nextPage].length !== unitPageSize) {
      if (nextPage === totalUnitPage) {
        if (units[nextPage]?.length === totalUnit % unitPageSize) {
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
          <CardHeader p="6px 0px 22px 0px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              Units Table
            </Text>
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
    </Flex>
  );
};

export default UnitTabPanel;
