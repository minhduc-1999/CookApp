import React from "react";
import PropTypes from "prop-types";
import { useColorModeValue } from "@chakra-ui/react";
import {
  Paginator,
  Container,
  Previous,
  Next,
  PageGroup,
} from "chakra-paginator";
import { ChevronLeft, ChevronRight } from "components/Icons/Icons";

function CustomPaginator(props) {
  const { pagesQuantity, currentPage, onPageChange } = props;
  const bgColor = useColorModeValue("white", "inherit");

  // styles
  const baseStyles = {
    w: 10,
    fontSize: "sm",
  };

  const normalStyles = {
    ...baseStyles,
    bg: bgColor,
    _hover: {
      bg: "teal.300",
    },
  };

  const activeStyles = {
    ...baseStyles,
    bg: "teal.300",
    _hover: {
      bg: "teal.300",
    },
  };

  const separatorStyles = {
    ...baseStyles,
    bg: bgColor,
  };

  return (
    <Paginator
      pagesQuantity={pagesQuantity}
      currentPage={currentPage}
      onPageChange={onPageChange}
      outerLimit={2}
      innerLimit={2}
      activeStyles={activeStyles}
      normalStyles={normalStyles}
      separatorStyles={separatorStyles}
    >
      <Container>
        <Previous w={10} mr={3}>
          <ChevronLeft />
        </Previous>
        <PageGroup isInline align="center" />
        <Next w={10} ml={3}>
          <ChevronRight />
        </Next>
      </Container>
    </Paginator>
  );
}

Paginator.propTypes = {
  pagesQuantity: PropTypes.number,
  currentpage: PropTypes.number,
  onPageChange: PropTypes.func,
};

export default CustomPaginator;
