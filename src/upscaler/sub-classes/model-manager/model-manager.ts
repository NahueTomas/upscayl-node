import { join } from 'path';

export class ModelManager {
  private models: Model[] = [
    join(__dirname, "models", "realesrgan-x4fast"),
    join(__dirname, "models", "realesrgan-x4plus"),
    join(__dirname, "models", "remacri"),
  ];

  public addModel(model: Model): Model {
    this.models.push(model);
    return model;
  }

  public getModels() {
    return this.models;
  }
}

export type Model = string;
