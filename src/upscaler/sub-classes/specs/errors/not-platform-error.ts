import { UpscaleError } from '../../../errors/upscale-error';

export class SpecsNotPlatformError extends UpscaleError {
  constructor() {
    super('Platform not found, device not compatible', 'specs');

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecsNotPlatformError.prototype);
  }
}
