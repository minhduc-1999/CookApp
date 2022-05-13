import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
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
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { canSaveFood } from "apis/foods";
import UploadedImage from "components/UploadedImage";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

type Ingredient = {
  name: string;
  unit: string;
  quantity: number;
};

type IngredientAddingRowProps = {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onDelete: () => void;
  ingredientList: string[];
  unitList: string[];
};

const IngredientAddingRow = ({
  ingredient,
  onChange,
  onDelete,
  ingredientList,
  unitList,
}: IngredientAddingRowProps) => {
  const [deleteBtnOpacity, setDeleteBtnOpacity] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState(ingredient.name);
  const [selectedUnit, setSelectedUnit] = useState(ingredient.unit);
  const [selectedQuantity, setSelectedQuantity] = useState(ingredient.quantity);
  const [isIngredientError, setIsIngredientError] = useState(false);
  const [isQuantityError, setIsQuantityError] = useState(false);
  const [isUnitError, setIsUnitError] = useState(false);

  const onAnyChange = (ingredient: string, unit: string, quantity: number) => {
    onChange({
      quantity,
      unit,
      name: ingredient,
    });
  };
  return (
    <Flex
      gap={2}
      onMouseLeave={() => {
        setDeleteBtnOpacity(0);
      }}
      onMouseOver={() => {
        setDeleteBtnOpacity(1);
      }}
      direction="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      w="100%"
    >
      <FormControl isInvalid={isIngredientError}>
        <Select
          placeholder="Ingredient..."
          value={selectedIngredient ? selectedIngredient : undefined}
          onChange={(e) => {
            const { value } = e.target;
            setSelectedIngredient(value);
            if (!value) {
              setIsIngredientError(true);
            } else setIsIngredientError(false);
            onAnyChange(value, selectedUnit, selectedQuantity);
          }}
        >
          {ingredientList?.map((ing, index) => (
            <option key={index} value={ing}>
              {ing}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isInvalid={isQuantityError}>
        <NumberInput
          id="quantity"
          step={0.5}
          precision={1}
          defaultValue={0}
          min={0}
          max={180}
          maxW={200}
          value={selectedQuantity}
          onChange={(_, value) => {
            setSelectedQuantity(value);
            if (value <= 0) {
              setIsQuantityError(true);
            } else setIsQuantityError(false);
            onAnyChange(selectedIngredient, selectedUnit, value);
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <FormControl isInvalid={isUnitError}>
        <Select
          placeholder="Unit..."
          value={selectedUnit ? selectedUnit : undefined}
          onChange={(e) => {
            const { value } = e.target;
            setSelectedUnit(value);
            if (!value) {
              setIsUnitError(true);
            } else setIsUnitError(false);
            onAnyChange(selectedIngredient, value, selectedQuantity);
          }}
        >
          {unitList?.map((unit, index) => (
            <option key={index} value={unit}>
              {unit}
            </option>
          ))}
        </Select>
      </FormControl>
      <IconButton
        bgColor={"inherit"}
        opacity={deleteBtnOpacity}
        aria-label="Delete item"
        icon={<DeleteIcon />}
        onClick={onDelete}
      />
    </Flex>
  );
};

type StepAddingRowProps = {
  step: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
};

const StepAddingRow = ({ step, onChange, onDelete }: StepAddingRowProps) => {
  const [deleteBtnOpacity, setDeleteBtnOpacity] = useState(0);
  return (
    <Flex
      gap={2}
      onMouseLeave={() => {
        setDeleteBtnOpacity(0);
      }}
      onMouseOver={() => {
        setDeleteBtnOpacity(1);
      }}
      direction="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      w="100%"
    >
      <Input onChange={onChange} value={step} />
      <IconButton
        bgColor={"inherit"}
        opacity={deleteBtnOpacity}
        aria-label="Delete item"
        icon={<DeleteIcon />}
        onClick={onDelete}
      />
    </Flex>
  );
};

type CreateFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateFoodModal = ({ isOpen, onClose }: CreateFoodModalProps) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [stepList, setStepList] = useState<string[]>([]);
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [canSave, setCanSave] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foodPhotos, setFoodPhotos] = useState<ImageListType>([]);

  useEffect(() => {
    let checkSavingInterval: NodeJS.Timer;
    if (isOpen)
      checkSavingInterval = setInterval(() => {
        checkSaving();
      }, 500);

    return () => {
      if (checkSavingInterval) clearInterval(checkSavingInterval);
    };
  }, [isOpen, stepList, name, ingredientList, servings, totalTime, foodPhotos]);

  const onStepRowChange = (index: number) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const steps = [...stepList];
      steps[index] = value;
      setStepList(steps);
    };
  };

  const onAddStepRowClick = () => {
    const steps = [...stepList];
    steps.push("");
    setStepList(steps);
  };

  const onStepRowDelete = (index: number) => () => {
    const steps = [...stepList];
    steps.splice(index, 1);
    setStepList(steps);
  };

  const onAddIngredientRowClick = () => {
    const ingredients = [...ingredientList];
    ingredients.push({
      name: "",
      quantity: 0,
      unit: "",
    });
    setIngredientList(ingredients);
  };

  const onIngredientRowDelete = (index: number) => () => {
    const temp = [...ingredientList];
    temp.splice(index, 1);
    setIngredientList(temp);
  };

  const onIngredientRowChange = (index: number) => (ingredient: Ingredient) => {
    const temp = [...ingredientList];
    temp[index] = ingredient;
    setIngredientList(temp);
  };

  const checkSaving = () => {
    if (
      !canSaveFood({
        name,
        servings,
        totalTime,
        ingredients: ingredientList,
        steps: stepList.map((step) => {
          return { content: step };
        }),
        videoUrl,
        description,
        photos: foodPhotos.map((photo) => photo.file?.name || ""),
      })
    ) {
      setCanSave(false);
      return;
    }
    setCanSave(true);
  };

  const onUploadImagesChange = (
    imgList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setFoodPhotos(imgList);
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
        <ModalHeader>Create new food</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="food-name">Food name</FormLabel>
              <Input
                id="food-name"
                ref={initialRef}
                placeholder="Food name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FormControl>

            <Flex
              gap={4}
              w="100%"
              direction="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <FormControl isRequired>
                <FormLabel htmlFor="servings">Servings</FormLabel>
                <HStack>
                  <NumberInput
                    id="servings"
                    step={1}
                    defaultValue={1}
                    min={1}
                    max={10}
                    maxW={200}
                    value={servings}
                    onChange={(_, value) => {
                      setServings(value);
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText float={"left"}>(people)</FormHelperText>
                </HStack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="total-time">Total time</FormLabel>
                <HStack>
                  <NumberInput
                    value={totalTime}
                    onChange={(_, value) => {
                      setTotalTime(value);
                    }}
                    id="total-time"
                    step={1}
                    defaultValue={30}
                    min={1}
                    max={180}
                    maxW={200}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText float={"left"}>(minutes)</FormHelperText>
                </HStack>
              </FormControl>
            </Flex>
            <Accordion allowToggle w="100%">
              <AccordionItem borderTop={"none"}>
                <AccordionButton px={0}>
                  <FormControl isRequired>
                    <Flex
                      direction={"row"}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel>Ingredients</FormLabel>
                      <AccordionIcon />
                    </Flex>
                  </FormControl>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={2}>
                    {ingredientList?.map((ingredient, index) => (
                      <IngredientAddingRow
                        key={index}
                        ingredient={ingredient}
                        onChange={onIngredientRowChange(index)}
                        onDelete={onIngredientRowDelete(index)}
                        unitList={["Lit", "Cai", "Kg"]}
                        ingredientList={["Cu hanh", "Cu toi", "Duong"]}
                      />
                    ))}
                    <IconButton
                      aria-label="Add one more ingredient row"
                      icon={<PlusSquareIcon />}
                      w="100%"
                      onClick={onAddIngredientRowClick}
                    />
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem borderBottom="none">
                <AccordionButton px={0}>
                  <FormControl isRequired>
                    <Flex
                      direction={"row"}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabel>Steps</FormLabel>
                      <AccordionIcon />
                    </Flex>
                  </FormControl>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={2}>
                    {stepList?.map((step, index) => (
                      <StepAddingRow
                        key={index}
                        step={step}
                        onChange={onStepRowChange(index)}
                        onDelete={onStepRowDelete(index)}
                      />
                    ))}
                    <IconButton
                      aria-label="Add one more step row"
                      icon={<PlusSquareIcon />}
                      w="100%"
                      onClick={onAddStepRowClick}
                    />
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <ImageUploading
              multiple={false}
              value={foodPhotos}
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
                <FormControl isRequired>
                  <FormLabel htmlFor="photo">Photo</FormLabel>
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
            <FormControl>
              <FormLabel htmlFor="video-url">Video URL</FormLabel>
              <Input
                id="video-url"
                placeholder="Your food's video URL"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
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

export default CreateFoodModal;
