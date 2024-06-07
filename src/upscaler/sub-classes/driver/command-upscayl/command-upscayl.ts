import { spawn } from 'child_process';
import { basename, dirname, extname, join, resolve } from 'path';

import { getModelScale } from './utils/get-model-scale';

import {
  type Driver,
  type UpscaleOptionsFolderI,
  type UpscaleOptionsI,
  type UpscaleOptionsImageI,
} from '../driver';

export class CommandUpscayl implements Driver {
  public platform: string;
  public architecture: string;
  private execPath: string;

  constructor(architecture: string, platform: string) {
    this.architecture = architecture;
    this.platform = platform;

    this.execPath = resolve(
      join(__dirname, 'resources', platform!, 'bin', 'upscayl-bin'),
    );
  }

  // TODO: imagePath should be an image
  // TODO: imagePath should be an image with png, webp or jpg extension
  // TODO: imageOutputPath should be a dir
  public async upscaleImage(
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsImageI,
  ): Promise<string> {
    const imageName = basename(imagePath);
    const imageDefaultExt = extname(imageName);

    const command: string[] = this.generateArgs(imagePath, imageOutputPath, {
      saveImageAs: options.saveImageAs || imageDefaultExt,
      tileSize: options.tileSize || undefined,
      customWidth: options.customWidth,
      model: options.model,
      compression: options.compression || 0,
      scale: options.scale || 2,
    });

    this.runCommand(command);
    return imageOutputPath;
  }

  // TODO: folderPath should be a dir
  // TODO: folderOutputPath should be a dir
  public async upscaleFolder(
    folderPath: string,
    folderOutputPath: string,
    options: UpscaleOptionsFolderI,
  ): Promise<string> {
    const imageDefaultExt = 'png';

    const command: string[] = this.generateArgs(folderPath, folderOutputPath, {
      saveImageAs: options.saveImageAs || imageDefaultExt,
      tileSize: options.tileSize || undefined,
      customWidth: options.customWidth,
      model: options.model,
      compression: options.compression || 0,
      scale: options.scale || 2,
    });

    const spawn = this.runCommand(command);
    console.log(spawn.process);
    setTimeout(() => {
      spawn.kill();
    }, 5000);
    return folderOutputPath;
  }

  private runCommand(command: string[]) {
    const spawnedProcess = spawn(
      this.execPath,
      command.filter((arg) => arg !== ''),
      {
        cwd: undefined,
        detached: false,
      },
    );

    return { process: spawnedProcess, kill: () => spawnedProcess.kill() };
  }

  private generateArgs(
    inputPath: string,
    outputPath: string,
    options: GenerateArgsOptionsI,
  ): string[] {
    const modelName = basename(options.model);
    const modelDir = dirname(options.model);

    const modelScale = getModelScale(modelName);
    const includeScale = modelScale !== options.scale && !options.customWidth;

    return [
      // INPUT DIR
      '-i',
      inputPath,

      // OUTPUT DIR
      '-o',
      outputPath,

      // OUTPUT SCALE
      includeScale ? '-s' : '',
      includeScale ? options.scale.toString() : '',

      // MODELS PATH
      '-m',
      modelDir,

      // MODEL NAME
      '-n',
      modelName,

      // FORMAT
      '-f',
      options.saveImageAs,

      // CUSTOM WIDTH
      options.customWidth ? `-w` : '',
      options.customWidth ? options.customWidth.toString() : '',

      // COMPRESSION
      '-c',
      options.compression.toString(),

      // TILE SIZE
      options.tileSize ? `-t` : '',
      options.tileSize ? options.tileSize.toString() : '',
    ];
  }
}

interface GenerateArgsOptionsI extends UpscaleOptionsI {
  compression: number;
}
