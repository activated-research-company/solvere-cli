import { injectable } from "inversify";
import { Question } from "../question";
import { Answers } from "../answers";
import { DEVICE_ANSWERS } from "./device-answers";

@injectable()
class DeviceQuestion extends Question {
  constructor() {
    super(
      'device',
      'What device do you want to configure?',
      new Answers(DEVICE_ANSWERS),
    )
  }
}

export { DeviceQuestion };