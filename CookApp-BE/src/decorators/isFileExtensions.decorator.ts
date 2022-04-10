import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "fileExtension", async: false })
export class IsMeaningfullStringConstrain
  implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const extensions: string[] = args.constraints[0];
    const regexSring = `^\\S.*\\.(${extensions.join('|')})$`;
    const regex = new RegExp(regexSring);
    return regex.test(text)
  }

  defaultMessage(args: ValidationArguments) {
    const extensions: string[] = args.constraints[0];
    return `each value in ${args.property} must have one of following extensions ${extensions.join(', ')}`;
  }
}

export function IsFileExtensions(
  extentsion: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [extentsion],
      validator: IsMeaningfullStringConstrain,
    });
  };
}
