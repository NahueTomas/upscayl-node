import { ModelManager } from './sub-classes/model-manager/model-manager';
import { Upscaler } from './upscaler';
import { CommandUpscayl } from './sub-classes/driver/command-upscayl/command-upscayl';
import { Specs } from './sub-classes/specs/specs';

const specs = new Specs();
const arch = specs.getArch();
const platform = specs.getPlatform();

const modelManager = new ModelManager();
const commandUpscayl = new CommandUpscayl(arch, platform);

export const upscaler = new Upscaler(commandUpscayl, modelManager);
