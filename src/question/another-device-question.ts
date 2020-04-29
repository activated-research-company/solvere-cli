import { Question } from "./question";
import { YesNoAnswers } from './answers/yes-no-answers';

class AnotherDeviceQuestion extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'anotherDevice',
      'Would you like to configure another device?',
      new YesNoAnswers(),
    );
  }
}

export { AnotherDeviceQuestion };