import { Question } from "./question";

class IsDevicePluggedInQuestionTwo extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'confirm',
      'isDevicePluggedInTwo',
      'Is the device plugged in to a USB port on your computer?',
    );
  }
}

export { IsDevicePluggedInQuestionTwo };