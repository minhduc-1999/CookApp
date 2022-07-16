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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { canSaveUnit, createUnit } from "apis/units";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";

type CreateUnitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveCb: () => void;
};

const CreateUnitModal = ({
  isOpen,
  onClose,
  onSaveCb,
}: CreateUnitModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [toGram, setToGram] = useState(0);
  const [canSave, setCanSave] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

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
        toGram,
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
            <FormControl isRequired isInvalid={toGram ? false : true}>
              <FormLabel htmlFor="to-gram">To gram</FormLabel>
              <NumberInput
                min={1}
                value={toGram}
                onChange={(_, newValue) => {
                  setToGram(newValue);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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
                createUnit(
                  {
                    name,
                    toGram,
                  },
                  user?.accessToken
                )
                  .then(() => {
                    toast({
                      title: "Unit created",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                      position: "top-right",
                    });
                    onClose();
                    onSaveCb();
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

export default CreateUnitModal;
