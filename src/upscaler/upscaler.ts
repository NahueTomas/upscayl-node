import { dirname, join } from 'path';
import {
  Driver,
  UpscaleOptionsFolderI,
  UpscaleOptionsImageI,
} from './sub-classes/driver/driver';
import { UpscaleNotInitError } from './errors/upscale-not-init-error';
import { Model, ModelManager } from './sub-classes/model-manager/model-manager';

export class Upscaler {
  private driver: Driver;
  private modelManager: ModelManager;
  private on: boolean;

  constructor(driver: Driver, modelManager: ModelManager) {
    this.driver = driver;
    this.modelManager = modelManager;
    this.on = false;
  }

  public async init(): Promise<void> {
    const modelsFolder = join(dirname(__dirname), 'upscaler', 'models');
    await this.modelManager.init(modelsFolder);
    this.on = true;
  }

  async upscaleImage(
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsImageI,
  ) {
    if (!this.on) throw new UpscaleNotInitError();
    this.driver.upscaleImage(imagePath, imageOutputPath, options);
  }

  async upscaleFolder(
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsFolderI,
  ) {
    if (!this.on) throw new UpscaleNotInitError();
    this.driver.upscaleFolder(imagePath, imageOutputPath, options);
  }

  addModel(model: Model): Model {
    const modelAdded = this.modelManager.addModel(model);
    this.on = true;
    return modelAdded;
  }

  getModels(): Model[] {
    return this.modelManager.getModels();
  }
}
