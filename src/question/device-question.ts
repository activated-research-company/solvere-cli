import Question from './question';
import { Answers } from './answers/answers';
import { SerialDevice } from '../serial/serial-device';
import PhidgetDevice from '../phidget/phidget-device';

class DeviceQuestion extends Question<string> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'device',
      'What device do you want to configure?',
      new Answers({ ...SerialDevice, ...PhidgetDevice }),
    );
  }
}

export default DeviceQuestion;
