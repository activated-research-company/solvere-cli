#!/usr/bin/env node

import { container }  from './container.config';
import { TYPES } from './types';
import { Cli } from './cli/cli';
import { DeviceQuestion } from './question/device/device-question';

const cli = container.get<Cli>(TYPES.Cli);

cli
  .version('1.0.0')
  .action(() => {
    cli
      .ask(new DeviceQuestion())
      .then((answers: { [key: string]: string }) => {
        console.log(answers);
      });
  })
  .go();