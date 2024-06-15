import { basename, extname, join } from 'path';
import { stat } from 'fs/promises';

import { Driver, UpscaleOptionsI } from './sub-classes/driver/driver';
import { UpscalerNotInitError } from './errors/upscaler-not-init-error';
import { Model, ModelManager } from './sub-classes/model-manager/model-manager';
import { UpscalerBadOptionFieldError } from './errors/upscaler-bad-option-field-error';
import { UpscalerShouldBeImage } from './errors/upscaler-should-be-an-image';
import { UpscalerImagePathError } from './errors/upscaler-image-path-error';
import { UpscalerError } from './errors/upscaler-error';

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
    const modelsFolder = join(__dirname, 'models');
    await this.modelManager.init(modelsFolder);
    this.on = true;
  }

  public async upscaleImage(
    imagePath: string,
    imageOutputPath: string,
    options?: UpscaleUpscalerOptionsI,
  ): Promise<string> {
    // Check that upscaler has been init
    if (!this.on) throw new UpscalerNotInitError();

    // ===== CHECK imagePath =====
    // Check that the path imagePath is valid
    const imagePathFileName = basename(imagePath);
    const imageExt = extname(imagePathFileName);

    if (imageExt !== '.png' && imageExt !== '.jpg' && imageExt !== '.webp')
      throw new UpscalerShouldBeImage('imageOutputPath', imagePath);

    // Check that image exists
    const statImagePath = await stat(imagePath).catch((error) => {
      if (error?.code === 'ENOENT') throw new UpscalerImagePathError(imagePath);
      else throw new UpscalerError(error.message);
    });

    // Check that image is a file
    if (!statImagePath.isFile())
      throw new UpscalerShouldBeImage('imagePath', imagePath);

    // ===== CHECK imageOutputPath =====
    // Check image extension and if exists
    const imageOutputPathFileName = basename(imageOutputPath);
    const imageOutputExt = extname(imageOutputPathFileName);
    const imageOutputExtWithoutPoint = imageOutputExt?.split('.')?.[0];

    if (
      imageOutputExtWithoutPoint !== 'png' &&
      imageOutputExtWithoutPoint !== 'jpg' &&
      imageOutputExtWithoutPoint !== 'webp'
    )
      throw new UpscalerShouldBeImage('imageOutputPath', imageOutputPath);

    if (!basename(imageOutputPath))
      throw new UpscalerShouldBeImage('imageOutputPath', imageOutputPath);

    // Get options
    const optionsResult = this.getOptions(options);

    // Upscale
    return await this.driver.upscale(imagePath, imageOutputPath, optionsResult);
  }

  public addModel(model: Model): Model {
    const modelAdded = this.modelManager.addModel(model);
    this.on = true;
    return modelAdded;
  }

  public getModels(): Model[] {
    // Check that upscaler has been init
    if (!this.on) throw new UpscalerNotInitError();
    return this.modelManager.getModels();
  }

  private getOptions(
    options?: UpscaleUpscalerOptionsI,
    imageOutputExt?: ImageExt | undefined,
  ): UpscaleOptionsI {
    const opt = {
      model: options?.model ? options.model.toString() : this.getModels()[0],
      scale: options?.scale || 2,
      saveImageAs: imageOutputExt || 'png',
      compression: options?.compression || 0,
      tileSize: options?.tileSize,
      customWidth: options?.customWidth,
    };

    // Options error handling
    if (isNaN(Number(opt.scale)))
      throw new UpscalerBadOptionFieldError('scale', 'number');

    if (opt.compression && isNaN(Number(opt.compression)))
      throw new UpscalerBadOptionFieldError('compression', 'number');

    if (opt.tileSize && isNaN(Number(opt.tileSize)))
      throw new UpscalerBadOptionFieldError('tileSize', 'number');

    if (opt.customWidth && isNaN(Number(opt.customWidth)))
      throw new UpscalerBadOptionFieldError('customWidth', 'number');

    return opt;
  }
}

interface UpscaleUpscalerOptionsI {
  model?: string;
  scale?: number;
  tileSize?: number;
  compression?: number;
  customWidth?: number;
}

type ImageExt = 'jpg' | 'png' | 'webp';
