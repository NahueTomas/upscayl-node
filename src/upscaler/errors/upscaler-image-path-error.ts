import { UpscalerError } from './upscaler-error';

export class UpscalerImagePathError extends UpscalerError {
  private path: string;

  constructor(path: string) {
    super(`Image not found at ${path}`);
    this.path = path;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalerImagePathError.prototype);
  }
}
