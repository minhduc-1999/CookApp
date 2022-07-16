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
import { createFood } from "apis/foods";
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
  saveError: CreateFoodErrorType;
};

type IngredientRowErrorType =
  | "ingredientError"
  | "unitError"
  | "quantityError"
  | "none";

const IngredientAddingRow = ({
  ingredient,
  onChange,
  onDelete,
  ingredientList,
  unitList,
  saveError,
}: IngredientAddingRowProps) => {
  const [deleteBtnOpacity, setDeleteBtnOpacity] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState(ingredient.name);
  const [selectedUnit, setSelectedUnit] = useState(ingredient.unit);
  const [selectedQuantity, setSelectedQuantity] = useState(ingredient.quantity);
  const [error, setError] = useState<IngredientRowErrorType>("none");

  useEffect(() => {
    if (saveError === "ingredientsError") {
      if (!selectedIngredient) {
        setError("ingredientError");
        return
      }
      if (!selectedQuantity) {
        setError("quantityError");
        return
      }
      if (!selectedUnit) {
        setError("unitError");
        return
      }
    }
  }, [saveError]);

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
      <FormControl
        isInvalid={error === "ingredientError"}
        onFocus={() => setError("none")}
      >
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
      <FormControl
        isInvalid={error === "quantityError"}
        onFocus={() => setError("none")}
      >
        <NumberInput
          id="quantity"
          step={0.5}
          precision={1}
          defaultValue={1}
          min={1}
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
      <FormControl
        isInvalid={error === "unitError"}
        onFocus={() => setError("none")}
      >
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

type CreateFoodErrorType =
  | "nameError"
  | "descriptionError"
  | "servingsError"
  | "totalTimeError"
  | "videoUrlError"
  | "foodPhotosError"
  | "stepsError"
  | "ingredientsError"
  | "none";

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
  const [saving, setSaving] = useState(false);
  const [foodPhotos, setFoodPhotos] = useState<ImageListType>([]);
  const toast = useToast();
  const [error, setError] = useState<CreateFoodErrorType>("none");

  const [units, setUnits] = useState<UnitResponse[]>([]);
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

  const { user } = useAuth();

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
    switch (true) {
      case !name:
        setError("nameError");
        return false;
      case !description:
        setError("descriptionError");
        return false;
      case !servings:
        setError("servingsError");
        return;
      case !totalTime:
        setError("totalTimeError");
        return false;
      case !ingredientList || !ingredientList.length:
        setError("ingredientsError");
        return false;
      case !stepList || !stepList.length:
        setError("stepsError");
        return false;
      case !foodPhotos || !foodPhotos.length:
        return false;
    }
    for (const ingre of ingredientList) {
      if (!ingre.name || !ingre.unit || !ingre.quantity) {
        setError("ingredientsError");
        return false;
      }
    }
    for (const step of stepList) {
      if (!step) {
        setError("stepsError");
        return false;
      }
    }
    return true;
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

  const onInputFocus = () => {
    setError("none");
  };

  const clearAll = () => {
    setName("");
    setStepList([]);
    setIngredientList([]);
    setDescription("");
    setServings(0);
    setTotalTime(0);
    setVideoUrl("");
    setFoodPhotos([]);
  };

  const onSaveFood = () => {
    if (!checkSaving()) return;
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
        clearAll();
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
            <FormControl
              isRequired
              isInvalid={error === "nameError"}
              onFocus={() => setError("none")}
            >
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

            <FormControl
              isRequired
              isInvalid={error === "descriptionError"}
              onFocus={onInputFocus}
            >
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
              <FormControl
                isRequired
                isInvalid={error === "servingsError"}
                onFocus={onInputFocus}
              >
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

              <FormControl
                isRequired
                isInvalid={error === "totalTimeError"}
                onFocus={onInputFocus}
              >
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
              <AccordionItem
                border={error === "ingredientsError" ? "2px solid red" : "none"}
                borderRadius="5px"
                onFocus={onInputFocus}
              >
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
                        unitList={units}
                        ingredientList={ingredients}
                        saveError={error}
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

              <AccordionItem
                border={error === "stepsError" ? "2px solid red" : "none"}
                borderRadius="5px"
                onFocus={onInputFocus}
              >
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
            <FormControl isRequired>
              <FormLabel htmlFor="photo">Photo</FormLabel>
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
                  <VStack>
                    {imageList.length > 0 ? null : (
                      <Button
                        border={
                          error === "foodPhotosError" ? "2px solid red" : "none"
                        }
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
                )}
              </ImageUploading>
            </FormControl>
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
            <Button colorScheme="teal" onClick={onSaveFood}>
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
