// chakra imports
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { DetailIcon, UpgradeIcon } from "components/Icons/Icons";
import { FaEllipsisV } from "react-icons/fa";

type Props = {
  edit?: boolean;
  remove?: boolean;
  detail?: boolean;
  upgrade?: boolean;
  detailCallback?: () => void;
};

function RowMenuOption(props: Props) {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<FaEllipsisV />}
        variant="solid"
        bgColor={"inherit"}
      />
      <MenuList>
        {props.edit && <MenuItem icon={<EditIcon />}>Edit</MenuItem>}
        {props.detail && <MenuItem onClick={props.detailCallback} icon={<DetailIcon />}>Detail</MenuItem>}
        {props.upgrade && <MenuItem icon={<UpgradeIcon />}>Upgrade</MenuItem>}
        {props.remove && <MenuItem  icon={<DeleteIcon />}>Delete</MenuItem>}
      </MenuList>
    </Menu>
  );
}

export default RowMenuOption;
