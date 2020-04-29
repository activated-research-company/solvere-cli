import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPort from 'serialport';

class VocDeviceConfigurer implements SerialDeviceConfigurer {

  private parseData(data: any): string {
    return data.toString().replace(/(\r\n|\n|\r)/gm,"");
  }

  public configure(path: string): Promise<any> {
    const serialPort = new SerialPort(path, { autoOpen: false });
      return new Promise((resolve, reject) => {
        serialPort.on('data', (data) => {
          if (this.parseData(data) === '*** Config: Set output format to JSON.') {
            serialPort.close();
            resolve();
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
