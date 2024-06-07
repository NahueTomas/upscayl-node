import { readdir } from 'fs/promises';
import { ModelManagerHasInitBefore } from './errors/model-manager-has-init-before-error';
import { join } from 'path';

export class ModelManager {
  private models: Model[] = [];
  private hasInit: boolean = false;

  public async init(modelsFolder: string): Promise<void> {
    if (this.hasInit) throw new ModelManagerHasInitBefore();

    const files = await readdir(modelsFolder);
    files.forEach((file) => {
      if (
        file.endsWith('.param') ||
        file.endsWith('.PARAM') ||
        file.endsWith('.bin') ||
        file.endsWith('.BIN')
      ) {
        const model = file.substring(0, file.lastIndexOf('.')) || file;
        const resultModel = join(modelsFolder, model);

        if (!this.models.includes(resultModel)) {
          this.models.push(resultModel);
        }
      }
    });

    this.hasInit = true;
  }

  public addModel(model: Model): Model {
    this.models.push(model);
    return model;
  }

  public getModels() {
    return this.models;
  }
}

export type Model = string;
