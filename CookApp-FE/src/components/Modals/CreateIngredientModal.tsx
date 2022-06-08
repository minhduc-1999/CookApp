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
import { canSaveIngredient, createIngredient } from "apis/ingredients";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";

type CreateIngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateIngredientModal = ({
  isOpen,
  onClose,
}: CreateIngredientModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
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
      canSaveIngredient({
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
                createIngredient(
                  {
                    name,
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
