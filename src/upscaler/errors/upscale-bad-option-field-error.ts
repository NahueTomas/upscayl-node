import { UpscaleError } from './upscale-error';

export class UpscalBadOptionFieldError extends UpscaleError {
  constructor(field: string, type: string) {
    super(`The field ${field} in options should be type ${type}`);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalBadOptionFieldError.prototype);
  }
}
