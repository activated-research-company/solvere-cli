import { Command } from './command';
import { program } from 'commander';
import { injectable } from 'inversify';

@injectable()
class CommandImpl implements Command {
  version(str: string): this {
    program.version(str);
    return this;
  }
  action(fn: (...args: any[]) => void | Promise<void>): this {
    program.action(fn);
    return this;
  }
  parse(argv?: string[] | undefined): this {
    program.parse(argv);
    return this;
  }

}

export { CommandImpl };
