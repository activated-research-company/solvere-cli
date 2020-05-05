import Question from './question';
import { YesNoAnswers } from './answers/yes-no-answers';

class IsDevicePluggedInQuestionTwo extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'isDevicePluggedInTwo',
      'Is the device plugged in to a USB port on your computer?',
      new YesNoAnswers(),
    );
  }
}

export default IsDevicePluggedInQuestionTwo;
