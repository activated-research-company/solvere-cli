import { Answers } from './answers';

class YesNoAnswers extends Answers {
  constructor() {
    super({
      yes: 'Yes',
      no: 'No',
    });
  }
}

export { YesNoAnswers }