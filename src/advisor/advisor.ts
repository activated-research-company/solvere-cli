import { Observable } from 'rxjs';
import { Answers } from 'inquirer';

class Advisor {
  private adviseGiven: boolean = false;

  private onQuestionAnswered(): void {
    this.adviseGiven = false;
  }

  public connect(observable: Observable<Answers>) {
    observable.subscribe(this.onQuestionAnswered.bind(this));
  }

  private newLine() {
    if (!this.adviseGiven) { console.log(''); }
  }

  public advise(message?: string): Advisor {
    if (message) {
      this.newLine();
      console.log(message);
      this.newLine();
      this.adviseGiven = true;
    }
    return this;
  }
}

export default Advisor;
