#!/usr/bin/env node

import { blue } from 'chalk'
import figlet from 'figlet';
import { program } from 'commander';
import { prompt } from 'inquirer';

import Advisor from './advisor/advisor';
import { SerialDeviceConfigurerResolver } from './serial/serial-device-configurer-resolver';
import { SerialPortService } from './serial/serial-device-service';

import { Subject } from 'rxjs'
import QuestionRouter from './question/question-router';

const prompts = new Subject<any>();
const advisor = new Advisor()
  .advise(blue(figlet.textSync('SOLVERE - CLI')));

const serialDeviceConfigurerResolver = new SerialDeviceConfigurerResolver();
const serialPortService = new SerialPortService(serialDeviceConfigurerResolver);

program
  .version('1.0.0')
  .action(() => {
    const observable = prompt(prompts).ui.process;
    advisor.connect(observable);
    serialPortService.connect(observable);
    new QuestionRouter(advisor, prompts)
      .connectToPrompt(observable)
      .connectToConfiguration(serialPortService.getObservable())
      .route();
  })
  .parse(process.argv);