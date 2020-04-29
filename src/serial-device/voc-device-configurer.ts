import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPort from 'serialport';

class VocDeviceConfigurer implements SerialDeviceConfigurer {

  parseData(data: any): string {
    return data.toString().replace(/(\r\n|\n|\r)/gm,"");
  }

  configure(serialPort: SerialPort): Promise<boolean> {
      return new Promise((resolve, reject) => {
        serialPort.on('data', (data) => {
          if (this.parseData(data) === '*** Config: Set output format to JSON.') {
            serialPort.close();
            resolve(true);
          }
        });

        serialPort.open(() => {
          serialPort.write('J');
        })

        setTimeout(() => {
          if (serialPort.isOpen) {
            serialPort.close();
            reject('I did not receive a response from the sensor.');
          }
        }, 5000);

      return true;
    });
  }
}

export default VocDeviceConfigurer;
