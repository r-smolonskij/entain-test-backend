import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFinishTimeGreaterThanStartTime', async: false })
export class IsFinishTimeGreaterThanStartTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const startTimePropertyName = args.constraints[0];
    const finishTimePropertyName = args.constraints[1];
    const startTime = args.object[startTimePropertyName];
    const finishTime = args.object[finishTimePropertyName];

    if (startTime && finishTime) {
      return finishTime >= startTime;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const startTimePropertyName = args.constraints[0];
    const finishTimePropertyName = args.constraints[1];
    return `${finishTimePropertyName} must be greater than ${startTimePropertyName} or equal`;
  }
}

export function IsFinishTimeGreaterThanStartTime(
  startTimePropertyName: string,
  finishTimePropertyName?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [
        startTimePropertyName,
        finishTimePropertyName || propertyName,
      ],
      validator: IsFinishTimeGreaterThanStartTimeConstraint,
    });
  };
}
