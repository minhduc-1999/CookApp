import { EditIcon } from "@chakra-ui/icons";
import {
  VStack,
  Image,
  HStack,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { ImageType } from "react-images-uploading";

type Props = {
  image: ImageType;
  onImageUpdate: () => void;
  onImageRemove: () => void;
};
const UploadedImage = ({ image, onImageUpdate, onImageRemove }: Props) => {
  const [controlOpacity, setControlOpacity] = useState(0);
  return (
    <VStack
      onMouseLeave={() => {
        setControlOpacity(0);
      }}
      onMouseOver={() => {
        setControlOpacity(1);
      }}
      position="relative"
      gap="5px"
    >
      <Image
        src={image.dataURL ? image.dataURL : ""}
        alt=""
        boxSize={"100px"}
      />
      <HStack
        position={"absolute"}
        top={0}
        right={0}
        __css={{ margin: `0 !important` }}
        opacity={controlOpacity}
      >
        <IconButton
          size="sm"
          icon={<EditIcon />}
          onClick={onImageUpdate}
          aria-label="Update image button"
          borderRadius="3px"
          _hover={{ backgroundColor: "blackAlpha.100" }}
          backgroundColor="inherit"
          color="teal.300"
        />
        <CloseButton color="teal.300" onClick={onImageRemove} />
      </HStack>
    </VStack>
  );
};
export default UploadedImage;
