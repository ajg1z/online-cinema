import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNumberOrString', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    if (typeof value === `number` || typeof value === `string`) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be string or number`;
  }
}
