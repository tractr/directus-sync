import { DirectusSyncArgs } from './interfaces';
import { $ } from './shell';

export class DirectusSync {

  protected readonly globalOptions: string;

  constructor(protected readonly options: DirectusSyncArgs) {
    this.globalOptions = this.getOptionsString(options);
  }

  pull() {
    return $`npm start -- ${this.globalOptions} pull --dump-path ${this.options.dumpPath}`;
  }

  protected getOptionsString(options: DirectusSyncArgs)  {
    return `--directus-token ${options.token} --directus-url ${options.url}`;
  }


}
