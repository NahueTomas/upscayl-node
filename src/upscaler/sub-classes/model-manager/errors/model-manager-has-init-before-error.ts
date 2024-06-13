import { UpscalerError } from '../../../errors/upscaler-error';

export class ModelManagerHasInitBefore extends UpscalerError {
  constructor() {
    super(
      'The "modelManager.init()" has been executed before, it can happend only once',
    );
    this.where = 'model-manager';

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ModelManagerHasInitBefore.prototype);
  }
}
