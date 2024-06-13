import { UpscalerError } from '../../../errors/upscaler-error';

export class SpecsNotArchitectureError extends UpscalerError {
  constructor() {
    super('Architecture not found, device not compatible');
    this.where = 'specs';

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecsNotArchitectureError.prototype);
  }
}
