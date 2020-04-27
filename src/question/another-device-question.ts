import { Question } from "./question";

class AnotherDeviceQuestion extends Question<boolean> {
  constructor() {
    super(
      'confirm',
      'anotherDevice',
      'Would you like to configure another device?',
    );
  }
}

export { AnotherDeviceQuestion };