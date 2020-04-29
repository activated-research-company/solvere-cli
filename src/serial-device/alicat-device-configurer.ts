import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPort from 'serialport';

class AlicatDeviceConfigurer implements SerialDeviceConfigurer {
  private getId(data: any): void {
    console.log(data.toString()[0]);
  }
  
  configure(serialPort: SerialPort): Promise<boolean> {
    return new Promise((resolve, reject) => {
      serialPort.on('data', (data) => {
        this.getId(data);
        resolve();
      });
      serialPort.write('a');
      setTimeout(() => {
        if (serialPort.isOpen) {
          serialPort.close();
        }
        reject('I could not figure out the device identifier.');
      }, 5000);
    return true;
  });
  }
}

export default AlicatDeviceConfigurer;
