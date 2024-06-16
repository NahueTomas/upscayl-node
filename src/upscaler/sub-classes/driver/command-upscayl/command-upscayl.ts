import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { basename, dirname, extname, join, resolve } from 'path';

import { SingleBar, Presets } from 'cli-progress';

import { getModelScale } from './utils/get-model-scale';

import { type Driver, type UpscaleOptionsI } from '../driver';

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

  public async upscale(
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsI,
  ): Promise<string> {
    return new Promise((resolve, reject): void => {
      const imageName = basename(imagePath);
      const imageDefaultExt = extname(imageName);

      const bar = new SingleBar({}, Presets.legacy);
      bar.start(100, 0, {
        speed: 0,
      });

      const command: string[] = this.generateArgs(imagePath, imageOutputPath, {
        saveImageAs: options.saveImageAs || imageDefaultExt,
        tileSize: options.tileSize,
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
          const percent = dataString
            .slice(0, dataString.length - 1)
            ?.split(',')[0];
          bar.update(Number(percent));
          if (percent === 100) bar.stop();
        } else if (dataString.includes('Resizing')) {
          bar.update(100);
          bar.stop();
          console.log(dataString);
        } else if (dataString.includes('Error')) {
          spawn.kill();
          bar.stop();
          reject(dataString);
        }
      });
      spawn.process.on('error', (data) => {
        spawn.kill();
        bar.stop();
        reject(data.toString());
      });
      spawn.process.on('close', () => {
        spawn.kill();
        bar.stop();
        resolve(imageOutputPath);
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
    options: UpscaleOptionsI,
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
    process.on('exit', () => this.stopChildProcess());

    // Catches ctrl+c event
    process.on('SIGINT', () => this.stopChildProcess());

    // Catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', () => this.stopChildProcess());
    process.on('SIGUSR2', () => this.stopChildProcess());

    // Catches uncaught exceptions
    process.on('uncaughtException', () => this.stopChildProcess());
  }
}
