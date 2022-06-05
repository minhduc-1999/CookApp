import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { EyeIcon, EyeSlashIcon } from "components/Icons/Icons";
import { ChangeEvent, useState } from "react";

type Props = {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  placeholder: string;
  value: string;
  id: string;
};

export const PasswordInput = ({ value, onChange, placeholder, id , onFocus}: Props) => {
  const [show, setShow] = useState(false);
  return (
    <InputGroup size="md">
      <Input
        id={id}
        borderRadius="15px"
        fontSize="sm"
        size="lg"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder={placeholder}
      />
      <InputRightElement width="4.5rem" h={"100%"} right={0}>
        <IconButton
          bgColor={"transparent"}
          aria-label="show"
          icon={show ? <EyeIcon /> : <EyeSlashIcon />}
          h="1.75rem"
          size="sm"
          onClick={() => setShow(!show)}
        />
      </InputRightElement>
    </InputGroup>
  );
};
