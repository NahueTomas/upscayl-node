import { UpscaleError } from './upscale-error';

export class UpscaleImagePathError extends UpscaleError {
  private path: string;

  constructor(path: string) {
    super(`Image not found at ${path}`);
    this.path = path;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscaleImagePathError.prototype);
  }
}
