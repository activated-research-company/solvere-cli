import { Question } from "./question";

class IsDevicePluggedInQuestionOne extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'confirm',
      'isDevicePluggedInOne',
      'Is the device plugged in to a USB port on your computer?',
    );
  }
}

export { IsDevicePluggedInQuestionOne };