import { Answers } from 'inquirer';
import { Subject, Observable } from 'rxjs';
import Advisor from '../advisor/advisor';
import { Question } from './question';
import { DeviceQuestion } from './device-question';
import { IsDevicePluggedInQuestionOne } from './is-device-plugged-in-question-one';
import { IsDevicePluggedInQuestionTwo } from './is-device-plugged-in-question-two';
import { AnotherDeviceQuestion } from './another-device-question';
import { ConfigurationResult } from '../serial-port/serial-port-service';

class QuestionRouter {

  nextQuestionNumber: number;

  constructor(
    private advisor: Advisor,
    private subject: Subject<any>
  ) {
      this.nextQuestionNumber = 0;
  }

  private onConfigurationResult({ device, configured, error}: ConfigurationResult): void {
    if (configured) {
      this.advise(`I've succesfully configured the ${device}.`)
      return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
    }
    this.advise(error);
    return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
  }

  public connectToPrompt(observable: Observable<Answers>): QuestionRouter {
    observable.subscribe(this.onAnsweredQuestion.bind(this));
    return this;
  }

  public connectToConfiguration(observable: Observable<ConfigurationResult>): QuestionRouter {
    observable.subscribe(this.onConfigurationResult.bind(this));
    return this;
  }

  private advise(message?: string): void {
    this.advisor.advise(message);
  }

  private next(question: Question<any>): void {
    this.subject.next(question.serialize());
    this.nextQuestionNumber += 1;
  }

  public route(): void {
    this.next(new DeviceQuestion(this.nextQuestionNumber));
  }

  private quit(): void {
    this.advisor.advise('Ok, see you next time!');
    return this.subject.complete();
  }

  private onAnsweredQuestion({ name, answer }: Answers): void {
    if (answer === 'Quit') { return this.quit(); }

    switch (name.split('|')[0]) {
      case 'device':
        this.advise(`Please make sure the ${answer} is NOT plugged into your computer.`)
        return this.next(new IsDevicePluggedInQuestionOne(this.nextQuestionNumber));
      case 'isDevicePluggedInOne':
        if (answer === 'YES') {
          this.advise('Please unplug it then.');   
          return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
        }
        this.advise('Excellent! Go ahead and plug it in now.');
        return this.next(new IsDevicePluggedInQuestionTwo(this.nextQuestionNumber));
      case 'isDevicePluggedInTwo':
        if (answer === 'NO') {
          this.advise('I just... can\'t. Let\'s start over.');
          return this.next(new AnotherDeviceQuestion(this.nextQuestionNumber));
        }
        return;
      case 'anotherDevice':
        if (answer === 'YES') {
          console.log('');
          return this.next(new DeviceQuestion(this.nextQuestionNumber));
        }
        return this.quit();
    }
  }
}

export default QuestionRouter;
