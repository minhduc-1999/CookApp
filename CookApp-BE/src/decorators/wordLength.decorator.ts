import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

type WordLengthOption = {
  min: number;
  max: number;
};

@ValidatorConstraint({ name: "wordLength", async: false })
export class WordLengthConstrain implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const { min, max } = args.constraints[0] as WordLengthOption;
    if (!text) return false;
    const words = text.trim().split(" ");
    return words ? words.length >= min && words.length <= max : false;
  }

  defaultMessage(args: ValidationArguments) {
    const { min, max } = args.constraints[0] as WordLengthOption;
    const length = this.countWord(args.value);
    if (length < min)
      return `${args.property} must have at least ${min} ${
        min === 1 ? "word" : "words"
      }`;
    if (length > max)
      return `${args.property} must have at most ${max} ${
        max === 1 ? "word" : "words"
      }`;
    return `${args.property}'s amount of word must be between ${min}-${max}}`;
  }

  countWord(text: string): number {
    if (!text) return 0;
    return text.trim().split(" ").length;
  }
}

export function WordLength(
  min: number,
  max = 20,
  validationOptions?: ValidationOptions
) {
  const opt = {
    min: Math.min(min ?? 1, 1),
    max: Math.min(max ?? 20, 200),
  };
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [opt],
      validator: WordLengthConstrain,
    });
  };
}
