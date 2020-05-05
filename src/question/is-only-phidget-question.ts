import Question from './question';
import { YesNoAnswers } from './answers/yes-no-answers';

class IsOnlyPhidgetQuestion extends Question<boolean> {
  constructor(questionNumber: number) {
    super(questionNumber, 'isOnlyPhidget', 'Is this the only Phidget plugged into your computer?', new YesNoAnswers());
  }
}

export default IsOnlyPhidgetQuestion;
