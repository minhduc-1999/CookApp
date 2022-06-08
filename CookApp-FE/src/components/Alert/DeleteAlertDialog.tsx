import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
};
const DelelteAlertDialog = ({ isOpen, onClose, onDelete }: Props) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const triggerDelete = () => {
    setDeleting(true);
    onDelete()
      .then(() => {
        toast({
          title: "Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
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
        setDeleting(false);
        onClose();
      });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete ingredient
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} mr={3}>
              Cancel
            </Button>
            {deleting ? (
              <Button
                isLoading
                loadingText="Deleting"
                colorScheme="red"
                variant="outline"
              />
            ) : (
              <Button colorScheme="red" onClick={triggerDelete}>
                Delete
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DelelteAlertDialog;
