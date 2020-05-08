import { Answers } from 'inquirer';
import { Subject, Observable } from 'rxjs';
import chalk from 'chalk';
import Advisor from '../advisor/advisor';
import Question from './question';
import DeviceQuestion from './device-question';
import IsDevicePluggedInQuestionOne from './is-device-plugged-in-question-one';
import IsDevicePluggedInQuestionTwo from './is-device-plugged-in-question-two';
import AnotherDeviceQuestion from './another-device-question';
import ConfigurationResult from '../device/configuration-result';
import IsOnlyPhidgetQuestion from './is-only-phidget-question';
import Device from '../device/device';

class QuestionRouter {
  private nextQuestionNumber: number;

  constructor(private advisor: Advisor, private subject: Subject<any>) {
    this.nextQuestionNumber = 0;
  }

  private onConfigurationResult({ device, configured, error }: ConfigurationResult): void {
    if (configured) {
      this.advise(`I've succesfully configured the ${device}.`);
      return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
    }
    this.advise(error, chalk.red);
    return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
  }

  public connectToPrompt(observable: Observable<Answers>): QuestionRouter {
    observable.subscribe(this.onAnsweredQuestion.bind(this));
    return this;
  }

  public connectToConfigurationResult(observable: Observable<ConfigurationResult>): QuestionRouter {
    observable.subscribe(this.onConfigurationResult.bind(this));
    return this;
  }

  private advise(message?: string, color?: chalk.Chalk): void {
    this.advisor.advise(message, color);
  }

  private next(question: Question<any>): void {
    this.subject.next(question.serialize());
    this.nextQuestionNumber += 1;
  }

  public route(): void {
    this.next(new DeviceQuestion(this.nextQuestionNumber));
  }

  private quit(): void {
    this.advisor.advise("Ok. I'll see you next time!");
    this.subject.complete();
    // for some reason the Phidget configurers hold up the thread
    setTimeout(process.exit, 1000);
  }

  private onAnsweredQuestion({ name, answer }: Answers): void {
    if (answer === 'Quit') {
      this.quit();
    } else {
      switch (name.split('|')[0]) {
        case 'device':
          if (answer === Device.vintHubOne || answer === Device.vintHubTwo) {
            this.advise(`Please make sure the ${answer} is the only Phidget plugged into your computer.`);
            this.next(new IsOnlyPhidgetQuestion(this.nextQuestionNumber));
          } else {
            this.advise(`Please make sure the ${answer} is NOT plugged into your computer.`);
            this.next(new IsDevicePluggedInQuestionOne(this.nextQuestionNumber));
          }
          break;
        case 'isDevicePluggedInOne':
          if (answer === 'Yes') {
            this.advise('Please unplug it then.');
            this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
            break;
          }
          this.advise('Excellent! Go ahead and plug it in now.');
          this.next(new IsDevicePluggedInQuestionTwo(this.nextQuestionNumber));
          break;
        case 'isDevicePluggedInTwo':
          if (answer === 'No') {
            this.advise("I just... can't. Let's start over.");
            this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
          }
          break;
        case 'anotherDevice':
          if (answer === 'Yes') {
            console.log(''); // just a new line between questions (empty advise)
            this.next(new DeviceQuestion(this.nextQuestionNumber));
            break;
          }
          this.quit();
          break;
        case 'isOnlyPhidget':
          if (answer === 'No') {
            this.advise("I just... can't. Let's start over.");
            this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
          }
          break;
        default:
          this.advise('Invalid option selected.');
          this.next(new DeviceQuestion(this.nextQuestionNumber));
          break;
      }
    }
  }
}

export default QuestionRouter;
