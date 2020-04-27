import { Question } from "./question";

class IsDevicePluggedInQuestion extends Question<boolean> {
  constructor() {
    super(
      'confirm',
      'isDevicePluggedIn',
      'Is the device plugged in to a USB port on your computer?',
    );
  }
}

export { IsDevicePluggedInQuestion };