import { UpscaleError } from './upscale-error';

export class UpscaleNotInitError extends UpscaleError {
  constructor() {
    super(
      'Please before do anything you must execute "await upscaler.init()"',
      'upscale',
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscaleNotInitError.prototype);
  }
}
