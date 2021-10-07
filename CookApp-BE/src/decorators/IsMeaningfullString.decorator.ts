import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'meaningfulString', async: false })
export class IsMeaningfullStringConstrain
  implements ValidatorConstraintInterface {
  private minWords: number;
  validate(text: string, args: ValidationArguments) {
    const words = text.trim().split(' ');
    this.minWords = Math.max(args.constraints[0] || 1, 1);
    return words[0] ? words.length >= this.minWords : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must have at least ${this.minWords} ${
      this.minWords === 1 ? 'word' : 'words'
    }!`;
  }
}

export function IsMeaningfullString(
  minWords?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minWords],
      validator: IsMeaningfullStringConstrain,
    });
  };
}
