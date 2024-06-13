export interface Driver {
  platform: string;
  architecture: string;

  upscale: (
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsI,
  ) => Promise<string>;
}

export interface UpscaleOptionsI {
  model: string;
  scale: number;
  saveImageAs: ImageExt;
  compression: number;
  customWidth?: number;
  tileSize?: number;
}

type ImageExt = 'jpg' | 'png' | 'webp';
