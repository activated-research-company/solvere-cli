import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPort from 'serialport';

class AlicatDevice implements SerialDeviceConfigurer {
  configure(serialPort: SerialPort): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export default AlicatDevice;
