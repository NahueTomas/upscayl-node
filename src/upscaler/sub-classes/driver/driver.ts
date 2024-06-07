export interface Driver {
  platform: string;
  architecture: string;

  upscaleImage: (
    imagePath: string,
    imageOutputPath: string,
    options: UpscaleOptionsI,
  ) => Promise<string>;

  upscaleFolder: (
    folderPath: string,
    forderOutputPath: string,
    options: UpscaleOptionsI,
  ) => Promise<string>;
}

export interface UpscaleOptionsI {
  model: string;
  scale: number;
  saveImageAs: ImageExt;
  customWidth: number | undefined;
  tileSize: number | undefined;
}

export interface UpscaleOptionsImageI extends UpscaleOptionsI {
  compression: number | undefined;
}
export interface UpscaleOptionsFolderI extends UpscaleOptionsI {
  compression: number | undefined;
}

type ImageExt = 'jpg' | 'png' | 'webp';
