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
import { canSaveIngredient, createIngredient } from "apis/ingredients";
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
  const [canSave, setCanSave] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  // useEffect(() => {
  //   let checkSavingInterval: NodeJS.Timer;
  //   if (isOpen)
  //     checkSavingInterval = setInterval(() => {
  //       checkSaving();
  //     }, 500);

  //   return () => {
  //     if (checkSavingInterval) clearInterval(checkSavingInterval);
  //   };
  // }, [isOpen, name]);

  const checkSaving = () => {
    if (
      canSaveIngredient({
        name,
        kcal,
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
        <ModalHeader>Create new ingredient</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={name ? false : true}>
              <FormLabel htmlFor="ingredient-name">Name</FormLabel>
              <Input
                id="ingredient-name"
                ref={initialRef}
                placeholder="Ingredient name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  checkSaving()
                }}
              />
            </FormControl>

            <FormControl isRequired isInvalid={kcal ? false : true}>
              <FormLabel htmlFor="kcal">Kcal</FormLabel>
              <NumberInput
                min={0}
                value={kcal}
                onChange={(_, newValue) => {
                  setKcal(newValue);
                  checkSaving()
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

export default CreateIngredientModal;
