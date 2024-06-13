import { basename, extname, join } from 'path';
import { stat } from 'fs/promises';

import { Driver, UpscaleOptionsI } from './sub-classes/driver/driver';
import { UpscaleNotInitError } from './errors/upscale-not-init-error';
import { Model, ModelManager } from './sub-classes/model-manager/model-manager';
import { UpscaleImageFormatError } from './errors/upscale-image-format-error';
import { UpscalBadOptionFieldError } from './errors/upscale-bad-option-field-error';
import { UpscaleShouldBeImage } from './errors/upscale-should-be-an-image';
import { UpscaleImagePathError } from './errors/upscale-image-path-error';
import { UpscaleError } from './errors/upscale-error';

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

  async upscaleImage(
    imagePath: string,
    imageOutputPath: string,
    options?: UpscaleUpscalerOptionsI,
  ) {
    // Check that upscaler has been init
    if (!this.on) throw new UpscaleNotInitError();

    // ===== CHECK imagePath =====
    // Check that the path imagePath is valid
    const imagePathFileName = basename(imagePath);
    const imageExt = extname(imagePathFileName);

    if (imageExt !== '.png' && imageExt !== '.jpg' && imageExt !== '.webp')
      throw new UpscaleShouldBeImage('imageOutputPath', imagePath);

    // Check that image exists
    const statImagePath = await stat(imagePath).catch((error) => {
      if (error?.code === 'ENOENT') throw new UpscaleImagePathError(imagePath);
      else throw new UpscaleError(error.message);
    });

    // Check that image is a file
    if (!statImagePath.isFile())
      throw new UpscaleShouldBeImage('imagePath', imagePath);

    // ===== CHECK imageOutputPath =====
    // Check image extension and if exists
    const imageOutputPathFileName = basename(imageOutputPath);
    const imageOutputExt = extname(imageOutputPathFileName);

    if (
      imageOutputExt !== '.png' &&
      imageOutputExt !== '.jpg' &&
      imageOutputExt !== '.webp'
    )
      throw new UpscaleShouldBeImage('imageOutputPath', imageOutputPath);

    if (!basename(imageOutputPath))
      throw new UpscaleShouldBeImage('imageOutputPath', imageOutputPath);

    // Get options
    const optionsResult = this.getOptions(options);

    // Upscale
    return await this.driver.upscale(imagePath, imageOutputPath, optionsResult);
  }

  addModel(model: Model): Model {
    const modelAdded = this.modelManager.addModel(model);
    this.on = true;
    return modelAdded;
  }

  getModels(): Model[] {
    // Check that upscaler has been init
    if (!this.on) throw new UpscaleNotInitError();
    return this.modelManager.getModels();
  }

  getOptions(options?: UpscaleUpscalerOptionsI): UpscaleOptionsI {
    const opt = {
      model: options?.model ? options.model.toString() : this.getModels()[0],
      scale: options?.scale || 2,
      saveImageAs: options?.saveImageAs || 'png',
      compression: options?.compression || 0,
      tileSize: options?.tileSize,
      customWidth: options?.customWidth,
    };

    // Options error handling
    if (isNaN(Number(opt.scale)))
      throw new UpscalBadOptionFieldError('scale', 'number');

    if (
      opt.saveImageAs !== 'jpg' &&
      opt.saveImageAs !== 'webp' &&
      opt.saveImageAs !== 'png'
    )
      throw new UpscaleImageFormatError();

    if (opt.compression && isNaN(Number(opt.compression)))
      throw new UpscalBadOptionFieldError('compression', 'number');

    if (opt.tileSize && isNaN(Number(opt.tileSize)))
      throw new UpscalBadOptionFieldError('tileSize', 'number');

    if (opt.customWidth && isNaN(Number(opt.customWidth)))
      throw new UpscalBadOptionFieldError('customWidth', 'number');

    return opt;
  }
}

interface UpscaleUpscalerOptionsI {
  model?: string;
  scale?: number;
  tileSize?: number;
  compression?: number;
  saveImageAs?: ImageExt;
  customWidth?: number;
}

type ImageExt = 'jpg' | 'png' | 'webp';
