import SerialPort from 'serialport';

interface SerialDeviceConfigurer {
  configure(serialPort: SerialPort): Promise<boolean>;
}

export default SerialDeviceConfigurer;
