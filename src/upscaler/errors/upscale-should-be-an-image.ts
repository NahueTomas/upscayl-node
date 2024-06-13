import { UpscaleError } from './upscale-error';

export class UpscaleShouldBeImage extends UpscaleError {
  private path: string;

  constructor(name: string, path: string) {
    super(`${name} must be an image's path with webp, jpg or png extension`);
    this.path = path;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscaleShouldBeImage.prototype);
  }
}
