import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    const twentyKb = oneKb * 25;
    console.log('value.size', value.size, metadata);
    return value.size < twentyKb ? value : false;
  }
}