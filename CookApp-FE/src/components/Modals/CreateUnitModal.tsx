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
import { canSaveUnit } from "apis/units";
import { useEffect, useRef, useState } from "react";

type CreateUnitModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const saveUnit = async (body: { name: string }) => {
  // TODO
  console.log(body);
};

const CreateUnitModal = ({ isOpen, onClose }: CreateUnitModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [canSave, setCanSave] = useState(true);
  const [saving, setSaving] = useState(false);
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
  }, [isOpen, name]);

  const checkSaving = () => {
    if (
      canSaveUnit({
        name,
      })
    ) {
      setCanSave(true);
      return;
    }
    setCanSave(false);
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
        <ModalHeader>Create new unit</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={name ? false : true}>
              <FormLabel htmlFor="unit-name">Name</FormLabel>
              <Input
                id="unit-name"
                ref={initialRef}
                placeholder="Unit name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>
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
                saveUnit({
                  name,
                })
                  .then(() => {
                    toast({
                      title: "Unit created",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                    onClose();
                  })
                  .catch(() => {
                    toast({
                      title: "Fail to create unit",
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

export default CreateUnitModal;
