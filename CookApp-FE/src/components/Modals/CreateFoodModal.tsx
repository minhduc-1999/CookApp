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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { IngredientResponse, UnitResponse } from "apis/base.type";
import { canSaveFood, createFood } from "apis/foods";
import { getIngredients } from "apis/ingredients";
import { uploadImageToStorage } from "apis/storage";
import { getUnits } from "apis/units";
import UploadedImage from "components/UploadedImage";
import { useAuth } from "contexts/Auth/Auth";
import { useEffect, useRef, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

type Ingredient = {
  name: string;
  unit: string;
  quantity: number;
  kcal: number;
  toGram: number;
};

type IngredientAddingRowProps = {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onDelete: () => void;
  ingredientList: IngredientResponse[];
  unitList: UnitResponse[];
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

  const onAnyChange = (
    ingredientName: string,
    unit: string,
    quantity: number
  ) => {
    const newIngre = ingredientList.find((ing) => ing.name === ingredientName);
    const newUnit = unitList.find((u) => u.name === unit);
    onChange({
      quantity,
      unit,
      name: ingredientName,
      kcal: newIngre?.kcal ?? 0,
      toGram: newUnit?.toGram ?? 0,
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
      <FormControl isInvalid={selectedIngredient ? false : true}>
        <Select
          placeholder="Ingredient..."
          value={selectedIngredient ? selectedIngredient : undefined}
          onChange={(e) => {
            const { value } = e.target;
            setSelectedIngredient(value);
            onAnyChange(value, selectedUnit, selectedQuantity);
          }}
        >
          {ingredientList?.map((ing, index) => (
            <option key={index} value={ing.name}>
              {ing.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isInvalid={selectedQuantity ? false : true}>
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
      <FormControl isInvalid={selectedUnit ? false : true}>
        <Select
          placeholder="Unit..."
          value={selectedUnit ? selectedUnit : undefined}
          onChange={(e) => {
            const { value } = e.target;
            setSelectedUnit(value);
            onAnyChange(selectedIngredient, value, selectedQuantity);
          }}
        >
          {unitList?.map((unit, index) => (
            <option key={index} value={unit.name}>
              {unit.name}
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
  onChange: (value: string) => void;
  onDelete: () => void;
};

const StepAddingRow = ({ step, onChange, onDelete }: StepAddingRowProps) => {
  const [deleteBtnOpacity, setDeleteBtnOpacity] = useState(0);
  const [recipe, setRecipe] = useState(step);
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
      <FormControl isInvalid={recipe ? false : true}>
        <Input
          onChange={(e) => {
            const { value } = e.target;
            setRecipe(value);
            onChange(value);
          }}
          value={recipe}
        />
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

type CreateFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaveCb: () => void;
};

const INIT_UNIT_SIZE = 50;
const INIT_INGREDIENT_SIZE = 50;

const CreateFoodModal = ({
  isOpen,
  onClose,
  onSaveCb,
}: CreateFoodModalProps) => {
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
  const toast = useToast();

  const [units, setUnits] = useState<UnitResponse[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

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
  }, [
    isOpen,
    stepList,
    name,
    ingredientList,
    servings,
    totalTime,
    foodPhotos,
    description,
  ]);

  useEffect(() => {
    if (isOpen) {
      getUnits(user?.accessToken, 1, INIT_UNIT_SIZE).then((res) => {
        const [unitItems, _] = res;
        setUnits(unitItems);
      });
      getIngredients(user?.accessToken, 1, INIT_INGREDIENT_SIZE).then((res) => {
        const [ingreItems, _] = res;
        setIngredients(ingreItems);
      });
    }
  }, [isOpen]);

  const onStepRowChange = (index: number) => {
    return (value: string) => {
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
      kcal: 0,
      toGram: 1,
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
        photos: foodPhotos.map((photo) => photo.file?.name ?? ""),
      })
    ) {
      setCanSave(false);
      return;
    }
    setCanSave(true);
  };

  const saveFood = async (foodReq: {
    steps: string[];
    name: string;
    description?: string;
    servings: number;
    totalTime: number;
    videoUrl?: string;
    photos: ImageListType;
    ingredients: Ingredient[];
  }) => {
    const photoObjectName = await uploadImageToStorage(
      foodReq.photos[0],
      user?.accessToken
    );
    await createFood(
      {
        steps: foodReq.steps.map((step) => {
          return { content: step };
        }),
        name: foodReq.name,
        description: foodReq.description,
        servings: foodReq.servings,
        totalTime: foodReq.totalTime,
        videoUrl: foodReq.videoUrl,
        ingredients: foodReq.ingredients,
        photos: [photoObjectName],
      },
      user?.accessToken
    );
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
            <FormControl isRequired isInvalid={name ? false : true}>
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

            <FormControl isRequired isInvalid={description ? false : true}>
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
              <FormControl isRequired isInvalid={servings >= 1 ? false : true}>
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

              <FormControl isRequired isInvalid={totalTime >= 1 ? false : true}>
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
                  <FormControl
                    isRequired
                    isInvalid={ingredientList.length > 0 ? false : true}
                  >
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
                        unitList={units}
                        ingredientList={ingredients}
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
                  <FormControl
                    isRequired
                    isInvalid={stepList.length > 0 ? false : true}
                  >
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
                <FormControl
                  isRequired
                  isInvalid={foodPhotos.length > 0 ? false : true}
                >
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
                saveFood({
                  steps: stepList,
                  name,
                  servings,
                  totalTime,
                  ingredients: ingredientList,
                  photos: foodPhotos,
                  videoUrl,
                  description,
                })
                  .then(() => {
                    toast({
                      title: "Food created",
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
                      title: "Fail to create food",
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

export default CreateFoodModal;
