import { Pipe, PipeTransform } from '@angular/core';
import { fromByteArray } from 'base64-js/index';

import { TextEncoderLite } from 'text-encoder-lite/text-encoder-lite';

// import {base64js} from 'base64-js/base64js.min';

@Pipe({ name: 'base64EncodePipe' })
export class Base64EncodePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    const bytes = new TextEncoderLite('utf-8').encode(value);
    return fromByteArray(bytes);
  }
}
