import { Observable } from 'rxjs';
import { Answers } from 'inquirer';
import chalk from 'chalk';

class Advisor {
  private adviseGiven = false;

  private onQuestionAnswered(): void {
    this.adviseGiven = false;
  }

  public connectToPrompt(observable: Observable<Answers>): Advisor {
    observable.subscribe(this.onQuestionAnswered.bind(this));
    return this;
  }

  public advise(message?: string, color?: chalk.Chalk): Advisor {
    if (message) {
      if (!this.adviseGiven) {
        console.log('');
      }
      console.log(color ? color(message) : chalk.green(message));
      if (!this.adviseGiven) {
        console.log('');
      }
      this.adviseGiven = true;
    }
    return this;
  }
}

export default Advisor;
