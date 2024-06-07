import { UpscaleError } from '../../../errors/upscale-error';

export class SpecsNotArchitectureError extends UpscaleError {
  constructor() {
    super('Architecture not found, device not compatible', 'specs');

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SpecsNotArchitectureError.prototype);
  }
}
