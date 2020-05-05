import Question from './question';
import { YesNoAnswers } from './answers/yes-no-answers';

class IsDevicePluggedInQuestionOne extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'isDevicePluggedInOne',
      'Is the device plugged in to a USB port on your computer?',
      new YesNoAnswers(),
    );
  }
}

export default IsDevicePluggedInQuestionOne;
