import { arch, platform } from 'os';
import { SpecsNotPlatformError } from './errors/not-platform-error';
import { SpecsNotArchitectureError } from './errors/not-architecture-error';

export class Specs {
  private plat: string = platform();
  private ar: string = arch();

  public getPlatform(): string {
    switch (this.plat) {
      case 'aix':
      case 'freebsd':
      case 'linux':
      case 'openbsd':
      case 'android':
        return 'linux';
      case 'darwin':
      case 'sunos':
        return 'mac';
      case 'win32':
        return 'win';
    }

    throw new SpecsNotPlatformError();
  }

  public getArch(): string {
    switch (this.ar) {
      case 'x64':
        return 'x64';
      case 'x32':
        return 'x86';
      case 'arm':
        return 'arm';
      case 'arm64':
        return 'arm64';
    }

    throw new SpecsNotArchitectureError();
  }
}
