# Upscayl Node
Upscayl node prepares the [UPSCAYL CORE](https://github.com/upscayl/upscayl) to run in NodeJS.

```javascript
import { join } from "path"
import upscaler from 'upscayl-node';

const run = async () => {
  await upscaler.init();

  const outputImagePath = await upscaler.upscaleImage(
    join(__dirname, "./image-test.png")
    join(__dirname, "./image-test-result.png")
  );
};

run();
```

## Upscayl definition:
| Free and Open Source AI Image Upscaler

Upscayl lets you enlarge and enhance low-resolution images using advanced AI algorithms. Enlarge images without losing quality. It's almost like magic! 🎩🪄

Original repo: https://github.com/upscayl/upscayl

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install upscayl-node
```

### Upscale image example

Import module and start to use it.


# API reference
## Methods
### upscaler.init(): Promise<"void">
This method lets you to load the default models.

### upscaler.getModels(): model[]
This method lets you to get the models' path. It is util if you want to change the default model that upscale the image.

### upscaler.addModel(model: Model): Model
This method lets you to add a path where you have a custom model to the models' list.

### upscaler.upscaleImage(imagePath, imageOutputPathd, options?): Promise<"string">
This mehod allow you to upscale images with different custom options.
```javascript
import { join } from "path"
import { upscaler } from 'upscayl-node';

const run = async () => {
  // You have to init it.
  // Note: the init method lets you to load AI models
  await upscaler.init();

  // Once we have the upscaler with models loaded we can run it
  const outputImagePath = upscaler.upscaleImage(
    join(__dirname, "./image-test.png") // Absolute path from image to be upscaled
    join(__dirname, "./image-test-result.png") // Absolute path from image upscaled
  );
};

run();
```

#### imagePath
Absolute image path of the image to be upscaled. It only accepts png, jpg or webp images.

#### imageOutputPath
Absolute image path of the result image. You can choose a different image extension changing the image format of the original if you want. Only png, jpg or webp are allowed. 

#### options

| Property | Description | Type | Default
| -------- | ----------- | ---- | -------
| model    | Path of model to be used to upscale the image | string | upscaler.getModels()[0]
| scale    | Defines the scale that the image result will have based to the original image | number | 2
| compression | Define the final image compression | number | 0 
| tileSize | Define the final tile size image | number | 0 