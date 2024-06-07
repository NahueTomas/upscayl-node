import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { basename, dirname, extname, join, resolve } from 'path';
import { stdin } from 'process';

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
  private childProcesses: {
    process: ChildProcessWithoutNullStreams;
    kill: () => boolean;
  }[];

  constructor(architecture: string, platform: string) {
    this.architecture = architecture;
    this.platform = platform;
    this.childProcesses = [];

    this.execPath = resolve(
      join(__dirname, 'resources', platform, 'bin', 'upscayl-bin'),
    );

    this.eventsOnExit();
  }

  // TODO: imagePath should be an image
  // TODO: imagePath should be an image with png, webp or jpg extension
  // TODO: imageOutputPath should be a dir
  public async upscaleImage(
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsImageI,
  ): Promise<string> {
    return new Promise((resolve, reject): void => {
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
      const spawn = this.runCommand(command);
      this.childProcesses.push(spawn);

      spawn.process.stderr.on('data', (data) => {
        const dataString = data.toString().trim();
        if (dataString.includes('%')) {
          const percent = dataString.slice(0, dataString.length - 1);
          console.log(percent);
        } else if (dataString.includes('Resizing')) {
          console.log(dataString);
        } else if (dataString.includes('Error')) {
          spawn.kill();
          reject(dataString);
        }
      });
      spawn.process.on('error', (data) => reject(data.toString()));
      spawn.process.on('close', () => {
        console.log('Image ready');
        spawn.kill();
        resolve(imageOutputPath);
      });
    });
  }

  // TODO: folderPath should be a dir
  // TODO: folderOutputPath should be a dir
  public async upscaleFolder(
    folderPath: string,
    folderOutputPath: string,
    options: UpscaleOptionsFolderI,
  ): Promise<string> {
    return new Promise((resolve, reject): void => {
      const imageDefaultExt = 'png';

      const command: string[] = this.generateArgs(
        folderPath,
        folderOutputPath,
        {
          saveImageAs: options.saveImageAs || imageDefaultExt,
          tileSize: options.tileSize || undefined,
          customWidth: options.customWidth,
          model: options.model,
          compression: options.compression || 0,
          scale: options.scale || 2,
        },
      );

      const spawn = this.runCommand(command);
      this.childProcesses.push(spawn);
      spawn.process.stderr.on('data', (data) => {
        const dataString = data.toString().trim();
        if (dataString.includes('%')) {
          const percent = dataString.slice(0, dataString.length - 1);
          console.log(percent);
        } else if (dataString.includes('Resizing')) {
          console.log(dataString);
        } else if (dataString.includes('Error')) {
          spawn.kill();
          reject();
        }
      });
      spawn.process.on('error', (data) => reject(data.toString()));
      spawn.process.on('close', () => {
        console.log('Folder ready');
        spawn.kill();
        resolve(folderOutputPath);
      });
    });
  }

  private runCommand(command: string[]): {
    process: ChildProcessWithoutNullStreams;
    kill: () => boolean;
  } {
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
    const modelDir = resolve(dirname(options.model));

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

  private stopChildProcess() {
    this.childProcesses.forEach((child) => {
      child.kill();
    });
  }

  private eventsOnExit() {
    // Do something when app is closing
    stdin.on('exit', () => this.stopChildProcess());

    // Catches ctrl+c event
    stdin.on('SIGINT', () => this.stopChildProcess());

    // Catches "kill pid" (for example: nodemon restart)
    stdin.on('SIGUSR1', () => this.stopChildProcess());
    stdin.on('SIGUSR2', () => this.stopChildProcess());

    // Catches uncaught exceptions
    stdin.on('uncaughtException', () => this.stopChildProcess());
  }
}

interface GenerateArgsOptionsI extends UpscaleOptionsI {
  compression: number;
}
