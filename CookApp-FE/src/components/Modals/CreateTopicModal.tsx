import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { uploadImageToStorage } from "apis/storage";
import { canSaveTopic, createTopic } from "apis/topics";
import UploadedImage from "components/UploadedImage";
import { useEffect, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

type CreateTopicModalProps = {
  isOpen: boolean;
  onClose: () => void;
  saveCallback: () => void;
};

const CreateTopicModal = ({
  isOpen,
  onClose,
  saveCallback,
}: CreateTopicModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [canSave, setCanSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [topicCover, setTopicCover] = useState<ImageListType>([]);
  const toast = useToast();

  useEffect(() => {
    let checkSavingInterval: NodeJS.Timer;
    if (isOpen)
      checkSavingInterval = setInterval(() => {
        checkSaving();
      }, 500);

    return () => {
      if (checkSavingInterval) clearInterval(checkSavingInterval);
    };
  }, [isOpen, title, topicCover]);

  const checkSaving = () => {
    if (
      canSaveTopic({
        title,
        cover: topicCover[0]?.file?.name ?? "",
      })
    ) {
      setCanSave(true);
      return;
    }
    setCanSave(false);
  };

  const onUploadImagesChange = (
    imgList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setTopicCover(imgList);
  };

  const saveTopic = async () => {
    const photoObjectName = await uploadImageToStorage(topicCover[0]);
    await createTopic({
      title,
      cover: photoObjectName,
    });
  };

  const resetModal = () => {
    setTitle("");
    setSaving(false);
    setCanSave(false);
    setTopicCover([]);
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new topic</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={title ? false : true}>
              <FormLabel htmlFor="topic-name">Title</FormLabel>
              <Input
                id="topic-name"
                ref={initialRef}
                placeholder="Topic title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </FormControl>
            <ImageUploading
              multiple={false}
              value={topicCover}
              onChange={onUploadImagesChange}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                // write your building UI
                <FormControl
                  isRequired
                  isInvalid={topicCover.length > 0 ? false : true}
                >
                  <FormLabel htmlFor="cover-image">Cover image</FormLabel>
                  <VStack>
                    {imageList.length > 0 ? null : (
                      <Button
                        color={isDragging ? "red" : "inherit"}
                        onClick={onImageUpload}
                        w="100%"
                        {...dragProps}
                      >
                        Click or Drop here
                      </Button>
                    )}
                    {imageList.map((image, index) => (
                      <UploadedImage
                        image={image}
                        key={index}
                        onImageRemove={() => {
                          onImageRemove(index);
                        }}
                        onImageUpdate={() => {
                          onImageUpdate(index);
                        }}
                      />
                    ))}
                  </VStack>
                </FormControl>
              )}
            </ImageUploading>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {saving ? (
            <Button
              isLoading
              loadingText="Saving"
              colorScheme="teal"
              variant="outline"
            />
          ) : (
            <Button
              colorScheme="teal"
              onClick={() => {
                setSaving(true);
                saveTopic()
                  .then(() => {
                    toast({
                      title: "Topic created",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                    onClose();
                    saveCallback();
                    resetModal();
                  })
                  .catch((err: Error) => {
                    toast({
                      title: err.message,
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                  })
                  .finally(() => {
                    setSaving(false);
                  });
              }}
              disabled={!canSave}
            >
              Save
            </Button>
          )}
          <Button ml={3} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateTopicModal;
