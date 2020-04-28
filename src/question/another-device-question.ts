import { Question } from "./question";

class AnotherDeviceQuestion extends Question<boolean> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'confirm',
      'anotherDevice',
      'Would you like to configure another device?',
    );
  }
}

export { AnotherDeviceQuestion };