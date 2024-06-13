export class UpscalerError extends Error {
  public where: string;

  constructor(message: string) {
    super(message);
    this.where = 'upscaler';

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscalerError.prototype);
  }
}
