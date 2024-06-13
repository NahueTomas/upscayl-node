import { UpscalerError } from '../../../errors/upscaler-error';

export class SpecsNotPlatformError extends UpscalerError {
  constructor() {
    super('Platform not found, device not compatible');
    this.where = 'specs';

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecsNotPlatformError.prototype);
  }
}
