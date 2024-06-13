import { UpscalerError } from './upscaler-error';

export class UpscalerNotInitError extends UpscalerError {
  constructor() {
    super('Please before do anything you must execute "await upscaler.init()"');

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalerNotInitError.prototype);
  }
}
