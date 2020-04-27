#!/usr/bin/env node

import { blue } from 'chalk'
import figlet from 'figlet';
import { program } from 'commander';

import { DeviceQuestion } from './question/device-question';

import serialPortService from './serial-port/serial-port-service';
import { IsDevicePluggedInQuestion } from './question/is-device-plugged-in-question';
import { AnotherDeviceQuestion } from './question/another-device-question';

let startingOver = false;

function advise(message: string, startOver?: boolean): void {
  console.log('');
  console.log(message);
  console.log('');

  if(typeof(startOver) !== 'undefined') { startingOver = startOver; }
}

advise(blue(figlet.textSync('SOLVERE - CLI')));

function inquire() {
  new DeviceQuestion().ask()
  .then((answers) => answers.device)
  .then((device) => {
    serialPortService.setTargetDeviceType(device);
    advise(`Make sure the ${device} is NOT plugged into your computer.`)
    return new IsDevicePluggedInQuestion().ask();
  })
  .then((answers) => answers.isDevicePluggedIn)
  .then((isDevicePluggedIn: boolean) => {
    if (!isDevicePluggedIn) {
      return serialPortService
        .reset()
        .then(() => {
          advise('Excellent! Go ahead and plug it in now.');
          return new IsDevicePluggedInQuestion().ask();
        });
    }
    advise('Please unplug it then.', true);
  })
  .then((answers) => {
    if (startingOver || !answers) { return null; }
    return answers.isDevicePluggedIn;
  })
  .then((isDevicePluggedIn) => {
    if (startingOver) { return null; }
    if (isDevicePluggedIn) { return serialPortService.findNewSerialPort(); }
    advise('I just... can\'t. Let\s start over.', true);
  })
  .then((serialPort) => {
    if (startingOver) { return null; }
    if (serialPort) { return serialPortService.configure(serialPort); }
    advise(`I couldn\'t find the ${serialPortService.getTargetDeviceType()}. Please try again.`, true)
  }).then((configured) => {
    if (startingOver) { return null; }
    advise(configured ? `Sucessfully configured the ${serialPortService.getTargetDeviceType()}!` : 'Something went wrong!');
  })
  .then(() => {
    return new AnotherDeviceQuestion().ask();
  })
  .then((answers) => answers.anotherDevice)
  .then((anotherDevice) => {
    startingOver = false;
    if (anotherDevice) {
      console.log('');
      return inquire();
    }
    advise('Ok, see you next time!');
  });
}

program
  .version('1.0.0')
  .action(inquire)
  .parse(process.argv);