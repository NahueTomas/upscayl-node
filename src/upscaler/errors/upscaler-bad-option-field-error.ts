import { UpscalerError } from './upscaler-error';

export class UpscalerBadOptionFieldError extends UpscalerError {
  constructor(field: string, type: string) {
    super(`The field ${field} in options should be type ${type}`);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalerBadOptionFieldError.prototype);
  }
}
