#!/usr/bin/env node

import { blue } from 'chalk';
import figlet from 'figlet';
import { program } from 'commander';
import { prompt } from 'inquirer';
import { Subject } from 'rxjs';

import Advisor from './advisor/advisor';

import SerialDeviceConfigurerResolver from './serial/configurer/serial-device-configurer-resolver';
import SerialDeviceService from './serial/serial-device-service';

import PhidgetDeviceConfigurerResolver from './phidget/phidget-device-configurer-resolver';
import PhidgetDeviceService from './phidget/phidget-device-service';

import QuestionRouter from './question/question-router';
import ConfigurationResult from './device/configuration-result';

const advisor = new Advisor().advise(blue(figlet.textSync('SOLVERE - CLI')));

const prompts = new Subject<any>();
const observableConfigurationResult = new Subject<ConfigurationResult>();

const serialDeviceConfigurerResolver = new SerialDeviceConfigurerResolver();
const serialDeviceService = new SerialDeviceService(serialDeviceConfigurerResolver, observableConfigurationResult);

const phidgetDeviceConfigurerResolver = new PhidgetDeviceConfigurerResolver();
const phidgetDeviceService = new PhidgetDeviceService(phidgetDeviceConfigurerResolver, observableConfigurationResult);

program
  .version('1.0.0')
  .action(() => {
    const observablePrompt = prompt(prompts).ui.process;

    advisor.connectToPrompt(observablePrompt);

    serialDeviceService.connectToPrompt(observablePrompt).connectToConfigurationResult(observableConfigurationResult);
    phidgetDeviceService.connectToPrompt(observablePrompt).connectToConfigurationResult(observableConfigurationResult);

    new QuestionRouter(advisor, prompts)
      .connectToPrompt(observablePrompt)
      .connectToConfigurationResult(observableConfigurationResult)
      .route();
  })
  .parse(process.argv);
