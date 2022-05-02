import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'meaningfulString', async: false })
export class IsMeaningfulStringConstrain
  implements ValidatorConstraintInterface {
  private minWords: number;
  validate(text: string, args: ValidationArguments) {
    this.minWords = Math.max(args.constraints[0] || 1, 1);
    if (!text) return false
    const words = text.trim().split(' ');
    return words[0] ? words.length >= this.minWords : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must have at least ${this.minWords} ${
      this.minWords === 1 ? 'word' : 'words'
    }`;
  }
}

export function WordMaxLength(
  maxLength?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [maxLength],
      validator: IsMeaningfulStringConstrain,
    });
  };
}
