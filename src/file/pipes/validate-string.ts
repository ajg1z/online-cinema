import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ValidateString implements PipeTransform {
  transform(value: string, meta: ArgumentMetadata) {
    return value;
  }
}
