import { UpscalerError } from './upscaler-error';

export class UpscalerImageFormatError extends UpscalerError {
  constructor() {
    super('The image format should be png, jpg or webp');

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalerImageFormatError.prototype);
  }
}
