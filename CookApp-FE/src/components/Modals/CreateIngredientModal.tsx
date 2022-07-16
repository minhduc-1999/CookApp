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
import { createIngredient } from "apis/ingredients";
import { useAuth } from "contexts/Auth/Auth";
import { useRef, useState } from "react";

type CreateIngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveCb: () => void;
};

const CreateIngredientModal = ({
  isOpen,
  onClose,
  onSaveCb,
}: CreateIngredientModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState(0);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  const [nameError, setNameError] = useState(false);
  const [kcalError, setKcalError] = useState(false);

  const clearAll = () => {
    setName("");
    setKcal(0);
  };

  const saveIngredient = () => {
    if (!name) {
      setNameError(true);
      return;
    }
    if (isNaN(kcal) || kcal < 0) {
      setKcalError(true);
      return;
    }
    setSaving(true);
    createIngredient(
      {
        name,
        kcal,
      },
      user?.accessToken
    )
      .then(() => {
        toast({
          title: "Ingredient created",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
        onSaveCb();
        clearAll();
      })
      .catch(() => {
        toast({
          title: "Fail to create ingredient",
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

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new ingredient</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl
              isRequired
              isInvalid={nameError}
              onFocus={() => setNameError(false)}
            >
              <FormLabel htmlFor="ingredient-name">Name</FormLabel>
              <Input
                id="ingredient-name"
                ref={initialRef}
                placeholder="Ingredient name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>

            <FormControl
              isRequired
              isInvalid={kcalError}
              onFocus={() => setKcalError(false)}
            >
              <FormLabel htmlFor="kcal">Kcal</FormLabel>
              <NumberInput
                min={0}
                value={kcal}
                onChange={(_, newValue) => {
                  setKcal(newValue);
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
            <Button colorScheme="teal" onClick={saveIngredient}>
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

export default CreateIngredientModal;
