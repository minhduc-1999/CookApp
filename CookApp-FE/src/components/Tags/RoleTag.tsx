import { Badge } from "@chakra-ui/react";
import { RoleType } from "apis/base.type";

type Props = {
  data: {
    roleName: string;
    roleSign: RoleType;
  };
};

const RoleTag = (props: Props) => {
  const { roleName, roleSign } = props.data;
  let colorScheme: string = "black";
  if (roleSign === "user") colorScheme = "pink";
  if (roleSign === "manager") colorScheme = "blue";
  if (roleSign === "sys-admin") colorScheme = "gray";
  if (roleSign === "nutritionist") colorScheme = "green";
  return <Badge colorScheme={colorScheme} fontSize="1em">{roleName}</Badge>;
};
export default RoleTag;
