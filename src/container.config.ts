import 'reflect-metadata';
import { Container, decorate, injectable} from 'inversify';
import { TYPES } from './types';
import { Cli } from './cli/cli';
import { CliImpl } from './cli/cli-impl';
import { Command } from './command/command';
import { CommandImpl } from './command/command-impl';
import { Inquirer } from './inquirer/inquirer';
import { InquirerImpl } from './inquirer/inquirer-impl';

const container = new Container();

container.bind<Command>(TYPES.Command).to(CommandImpl);
container.bind<Inquirer>(TYPES.Inquirer).to(InquirerImpl);
container.bind<Cli>(TYPES.Cli).to(CliImpl);
export { container };