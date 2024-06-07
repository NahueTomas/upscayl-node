import { readdir } from 'fs/promises';
import { basename, extname, join } from 'path';
import { ModelManagerHasInitBefore } from './errors/model-manager-has-init-before-error';

export class ModelManager {
  private models: Model[] = [];
  private hasInit: boolean = false;

  public async init(modelsFolder: string): Promise<void> {
    if (this.hasInit) throw new ModelManagerHasInitBefore();

    const files = await readdir(modelsFolder);
    files.forEach((file) => {
      const modelName = basename(file);
      const modelExt = extname(modelName);
      if (modelExt !== '.bin') return null;

      this.models.push(join(modelsFolder, modelName));
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
