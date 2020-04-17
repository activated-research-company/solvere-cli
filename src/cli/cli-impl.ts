import { injectable, inject } from 'inversify';
import { Question } from '../question/question';
import { Command } from 'commander';
import { Inquirer } from 'inquirer';
import { Cli } from './cli';

@injectable()
class CliImpl implements Cli {
  constructor(
    @inject('Command') private command: Command,
    @inject ('Inquirer') private inquirer: Inquirer,
  ) {}

  public version(str: string): Cli {
    this.command.version(str);
    return this;
  }

  public action(fn: (...args: any[]) => void | Promise<void>): Cli {
    this.command.action(fn);
    return this;
  }

  public ask(question: Question): Promise<{ [key: string]: string }> {
    return this.inquirer.prompt({
      type: 'list',
      name: question.getName(),
      message: question.getMessage(),
      choices: question.getAnswers(),
    });
  }

  public go(): void {
    this.command.parse(process.argv);
  }
}

export { CliImpl };
