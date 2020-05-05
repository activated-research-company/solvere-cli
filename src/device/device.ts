import { SerialDevice } from '../serial/serial-device';
import PhidgetDevice from '../phidget/phidget-device';

const Device = {
  ...SerialDevice,
  ...PhidgetDevice,
};

export default Device;
