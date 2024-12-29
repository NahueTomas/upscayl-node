# Upscayl Node
Upscayl node prepares the [UPSCAYL CORE](https://github.com/upscayl/upscayl) to run in NodeJS.

```javascript
const { join } = require("path");
const { upscaler } = require("upscayl-node");

const run = async () => {
  const outputImagePath = await upscaler.upscaleImage(
    join(__dirname, "./image-test.png"),
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

# API reference
## Methods
### upscaler.init(): Promise<"void">
This method allows you to load the default AI models.

### upscaler.getModels(): model[]
This method allows you to obtain the path of the models. It is useful if you want to change the default model that upscales the image.

### upscaler.addModel(model: Model): Model
This method allows you to add a path where you have a custom model to the list of models.

### upscaler.upscaleImage(imagePath, imageOutputPath, options?): Promise<"string">
This method allows you to upscale an image with various custom options.

```javascript
const { join } = require("path");
const { upscaler } = require("upscayl-node");

const run = async () => {
  // Once we have the upscaler with models loaded we can run it
  const outputImagePath = await upscaler.upscaleImage(
    join(__dirname, "./image-test.png"),       // Absolute path from image to be upscaled
    join(__dirname, "./image-test-result.png") // Absolute path from image upscaled
  );
};

run();
```

#### imagePath
Absolute image path of the image to be upscaled. Only png, jpg or webp images are accepted.

#### imageOutputPath
Absolute image path of the resulting image. You can choose a different image extension, which will change the image format of the original if you wish. Only png, jpg or webp are allowed.

#### options

| Property | Description | Type | Default
| -------- | ----------- | ---- | -------
| model    | Absolute path of the model used to upscale the image. | string | `upscaler.getModels()[0]`
| scale    | Specifies the scale of the resulting image relative to the original image. | number | 2
| compression | Set the final image compression. | number | 0 
| tileSize | Define the final tile size of the image. | number | 0 