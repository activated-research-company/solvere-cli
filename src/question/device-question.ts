import { Question } from "./question";
import { Answers } from "./answers";

enum DeviceAnswers {
  cellAir = 'Alicat Flow Controller (Cell Air)',
  fidAir = 'Alicat Flow Controller (FID Air)',
  fidHydrogen = 'Alicat Flow Controller (FID Hydrogen)',
  pressureController = 'Alicat Pressure Controller',
  vocSensor = 'Ohmtech VOC Sensor',
  quit = 'Quit',
};

class DeviceQuestion extends Question<string> {
  constructor(questionNumber: number) {
    super(
      questionNumber,
      'list',
      'device',
      'What device do you want to configure?',
      new Answers(DeviceAnswers),
    )
  }
}

export { DeviceQuestion, DeviceAnswers };
