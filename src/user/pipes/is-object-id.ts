import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

export class IsObjectId implements PipeTransform {
  transform(value: string, meta: ArgumentMetadata) {
    if (meta.type !== 'param') return value;
    if (Types.ObjectId.isValid(value)) return value;
    throw new BadRequestException('id must be ObjectId');
  }
}
