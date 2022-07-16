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
import { createUnit } from "apis/units";
import { useAuth } from "contexts/Auth/Auth";
import { useRef, useState } from "react";

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
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const [nameError, setNameError] = useState(false);
  const [toGramError, setToGramError] = useState(false);

  const saveUnit = () => {
    if (!name) {
      setNameError(true);
      return;
    }
    if (!toGram) {
      setToGramError(true);
      return;
    }
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
        clearAll();
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
  };

  const clearAll = () => {
    setName("");
    setToGram(0);
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
            <FormControl
              isRequired
              isInvalid={nameError}
              onFocus={() => setNameError(false)}
            >
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
            <FormControl
              onFocus={() => setToGramError(false)}
              isRequired
              isInvalid={toGramError}
            >
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
            <Button colorScheme="teal" onClick={saveUnit}>
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
