import 'reflect-metadata';
import { Container, decorate, injectable} from 'inversify';
import { TYPES } from './types';
import { Cli } from './cli/cli';
import { CliImpl } from './cli/cli-impl';
import { Command } from 'commander';
import { Inquirer } from 'inquirer';

const container = new Container();

container.bind<Cli>(TYPES.Cli).to(CliImpl);
decorate(injectable(), Command);
container.bind<Command>(TYPES.Command).toSelf();
export { container };