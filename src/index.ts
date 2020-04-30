#!/usr/bin/env node

import { blue } from 'chalk'
import figlet from 'figlet';
import { program } from 'commander';
import { prompt } from 'inquirer';

import Advisor from './advisor/advisor';
import { SerialDeviceConfigurerResolver } from './serial-device/configurer/serial-device-configurer-resolver';
import { SerialDeviceService } from './serial-device/serial-device-service';

import { Subject } from 'rxjs'
import QuestionRouter from './question/question-router';

const prompts = new Subject<any>();
const advisor = new Advisor()
  .advise(blue(figlet.textSync('SOLVERE - CLI')));

const serialDeviceConfigurerResolver = new SerialDeviceConfigurerResolver();
const serialDeviceService = new SerialDeviceService(serialDeviceConfigurerResolver);

program
  .version('1.0.0')
  .action(() => {
    const observable = prompt(prompts).ui.process;
    advisor.connect(observable);
    serialDeviceService.connect(observable);
    new QuestionRouter(advisor, prompts)
      .connectToPrompt(observable)
      .connectToConfiguration(serialDeviceService.getObservable())
      .route();
  })
  .parse(process.argv);