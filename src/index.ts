#!/usr/bin/env node

import { blue } from 'chalk'
import figlet from 'figlet';
import { program } from 'commander';
import { prompt } from 'inquirer';

import Advisor from './advisor/advisor';
import { SerialPortService } from './serial-port/serial-port-service';

import { Subject } from 'rxjs'
import QuestionRouter from './question/question-router';

const prompts = new Subject<any>();
const advisor = new Advisor()
  .advise(blue(figlet.textSync('SOLVERE - CLI')));

const serialPortService = new SerialPortService(advisor);

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