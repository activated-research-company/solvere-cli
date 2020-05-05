import SerialPort from 'serialport';
import { filter } from 'rxjs/operators';
import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPortOptions from './serial-port-options';

class VocDeviceConfigurer extends SerialDeviceConfigurer {
  private getSerialPortOptions() {
    return new SerialPortOptions(115200);
  }

  private parseData(data: any): string {
    return data.toString().replace(/(\r\n|\n|\r)/gm, '');
  }

  public setOutputFormatToJson(serialPort: SerialPort): Promise<any> {
    return new Promise((resolve, reject) => {
      const dataTimeout = setTimeout(() => {
        if (serialPort.isOpen) {
          dataSubscription.unsubscribe();
          this.device.complete();
          reject('I did not receive a response from the sensor.');
        }
      }, 5000);

      const dataSubscription = this.device.pipe(filter((device) => device.data)).subscribe(({ data }) => {
        if (this.parseData(data) === '*** Config: Set output format to JSON.') {
          clearTimeout(dataTimeout);
          dataSubscription.unsubscribe();
          this.device.complete();
          resolve();
        }
      });

      serialPort.write('J');
    });
  }

  public configure(path: string): Promise<any> {
    return this.getSerialPort(path, this.getSerialPortOptions())
      .then(this.setOutputFormatToJson.bind(this))
      .then(() => this.device.complete());
  }
}

export { VocDeviceConfigurer };
