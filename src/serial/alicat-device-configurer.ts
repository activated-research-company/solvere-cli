import SerialDeviceConfigurer from './serial-device-configurer';
import SerialPort from 'serialport';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
const Delimiter = require('@serialport/parser-delimiter'); // TODO: fix types so import works

class AlicatDeviceConfigurer implements SerialDeviceConfigurer {

  private readonly state: Subject<any>;

  constructor() {
    this.state = new Subject();
  }

  getSerialPortOptions() {
    return {
      autoOpen: false,
      baudRate: 19200,
      delimiter: Buffer.from('\r'),
    }
  }

  private write(serialPort: SerialPort, message: string) {
    serialPort.write(`${message}\r`);
  }

  private tryId(serialPort: SerialPort, id: string) {
    if (id) { this.write(serialPort, id); }
  }

  private figureOutId(serialPort: SerialPort): Promise<string> {
    return new Promise((resolve, reject) => {
      let tryNextIdTimeout: NodeJS.Timeout;

      const nextIdSubscription = this
        .state
        .pipe(filter(state => typeof(state.possibleIds) !== 'undefined'))
        .subscribe((state) => {
          if (state.possibleIds) {
            this.tryId(serialPort, state.possibleIds[0]);
            tryNextIdTimeout = setTimeout(() => {
              this.state.next({
                possibleIds: state.possibleIds.slice(1),
              });
            }, 1000);
          } else {
            nextIdSubscription.unsubscribe();
            dataSubscription.unsubscribe();
            reject('I could not figure out the device id.');
          }
        });

        const dataSubscription = this
          .state
          .pipe(filter((state) => state.data))
          .subscribe(({ data }) => {
            clearTimeout(tryNextIdTimeout);
            nextIdSubscription.unsubscribe();
            dataSubscription.unsubscribe();
            resolve(data[0].toLowerCase());
          });
      
      this.state.next({ possibleIds: 'abcdefghijklmnopqrstuvwxyz' });
    });
  }

  private setId(serialPort: SerialPort, id: string, newId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const dataTimeout = setTimeout(() => {
        dataSubscription.unsubscribe();
        reject(`Could not change the device id from ${id} to ${newId}.`);
      }, 1000);

      const dataSubscription = this
        .state
        .pipe(filter((state) => state.data))
        .subscribe(({ data }) => {
          clearTimeout(dataTimeout);
          dataSubscription.unsubscribe();
          resolve(data[0].toLowerCase());
        });

      this.write(serialPort, `${id}@=${newId}`);
    });
  }

  /**
  * Sets the ramp rate to the target setpoint
  *
  * @param serialPort  SerialPort to write commands to
  * @param id  Device id
  * @param rampRate  The rate to ramp to the setpoint in SCCM/s
  */
  private setRampRate(serialPort: SerialPort, id: string, rampRate: number) {
    return new Promise((resolve, reject) => {
      const dataTimeout = setTimeout(() => {
        dataSubscription.unsubscribe();
        reject(`Could not change the device ramp rate to ${rampRate}/s.`);
      }, 1000);

      const dataSubscription = this
        .state
        .pipe(filter(state => state.data))
        .subscribe(({ data }) => {
          switch (data) {
            case `${id.toUpperCase()}   160 = ${rampRate}`:
              this.write(serialPort, `${id}$$161=1000`);
              break;
            case `${id.toUpperCase()}   161 = 1000`:
              this.write(serialPort, `${id}$$162=4`);
              break;
            case `${id.toUpperCase()}   162 = 4`:
              dataSubscription.unsubscribe();
              resolve();
              break;
          }
          clearTimeout(dataTimeout);
        });

      this.write(serialPort, `${id}$$160=${rampRate}`);
    });
  }
  
  public configure(path: string): Promise<any> {
    const serialPortOptions = this.getSerialPortOptions();

    const serialPort = new SerialPort(path, serialPortOptions);

    serialPort
      .pipe(new Delimiter({ delimiter: serialPortOptions.delimiter }))
      .on('data', (data: any) => {
        this.state.next({ data: data.toString()[0] });
      });

    return new Promise(resolve => serialPort.open(resolve))
      .then(() => this.figureOutId(serialPort))
      .then((id) => this.setId(serialPort, id, 'x'))
      .then((id) => this.setRampRate(serialPort, id, 200))
      .then(() => serialPort.close());
  }
}

export default AlicatDeviceConfigurer;
