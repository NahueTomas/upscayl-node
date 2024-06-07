import { UpscaleError } from '../../../errors/upscale-error';

export class ModelManagerHasInitBefore extends UpscaleError {
  constructor() {
    super(
      'The "modelManager.init()" has been executed before, it can happend only once',
      'model-manager',
    );

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ModelManagerHasInitBefore.prototype);
  }
}
