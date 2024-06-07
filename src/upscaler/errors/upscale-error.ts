export class UpscaleError extends Error {
  public where: string;

  constructor(message: string, where: string) {
    super(message);
    this.where = where;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UpscaleError.prototype);
  }
}
