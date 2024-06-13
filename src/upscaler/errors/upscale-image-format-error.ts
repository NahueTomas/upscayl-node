import { UpscaleError } from './upscale-error';

export class UpscaleImageFormatError extends UpscaleError {
  constructor() {
    super('The image format should be png, jpg or webp');

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscaleImageFormatError.prototype);
  }
}
