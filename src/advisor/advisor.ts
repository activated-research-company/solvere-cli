import { Observable } from 'rxjs';
import { Answers } from 'inquirer';
import chalk from 'chalk';

class Advisor {
  private adviseGiven: boolean = false;

  private onQuestionAnswered(): void {
    this.adviseGiven = false;
  }

  public connect(observable: Observable<Answers>) {
    observable.subscribe(this.onQuestionAnswered.bind(this));
  }

  public advise(message?: string, color?: chalk.Chalk): Advisor {
    if (message) {
      if (!this.adviseGiven) { console.log(''); }
      console.log(color ? color(message) : chalk.green(message));
      if (!this.adviseGiven) { console.log(''); }
      this.adviseGiven = true;
    }
    return this;
  }
}

export default Advisor;
