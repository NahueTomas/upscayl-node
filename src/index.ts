import { ModelManager } from './upscaler/sub-classes/model-manager/model-manager';
import { Upscaler } from './upscaler/upscaler';
import { CommandUpscayl } from './upscaler/sub-classes/driver/command-upscayl/command-upscayl';
import { Specs } from './upscaler/sub-classes/specs/specs';

const specs = new Specs();
const arch = specs.getArch();
const platform = specs.getPlatform();

const modelManager = new ModelManager();
const commandUpscayl = new CommandUpscayl(arch, platform);

const upscaler = new Upscaler(commandUpscayl, modelManager);
export default upscaler;
