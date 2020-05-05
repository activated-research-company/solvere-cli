import SerialPort from 'serialport';
import { filter } from 'rxjs/operators';
import SerialDeviceConfigurer from '../serial-device-configurer';
import SerialPortOptions from '../serial-port-options';
import ConfigurerFunctionParms from './configurer-function-parms';

abstract class AlicatDeviceConfigurer extends SerialDeviceConfigurer {
  constructor(private targetId: string) {
    super();
  }

  getSerialPortOptions = (): SerialPortOptions => {
    return new SerialPortOptions(19200, Buffer.from('\r'));
  };

  write = (serialPort: SerialPort, message: string): void => {
    serialPort.write(`${message}\r`);
  };

  private tryId(serialPort: SerialPort, id: string) {
    if (id) {
      this.write(serialPort, id);
    }
  }

  protected figureOutId(serialPort: SerialPort): Promise<ConfigurerFunctionParms> {
    return new Promise((resolve, reject) => {
      let tryNextIdTimeout: NodeJS.Timeout;

      const nextIdSubscription = this.device
        .pipe(filter((device) => typeof device.possibleIds !== 'undefined'))
        .subscribe((device) => {
          if (device.possibleIds) {
            this.tryId(serialPort, device.possibleIds[0]);
            tryNextIdTimeout = setTimeout(() => {
              this.device.next({
                possibleIds: device.possibleIds.slice(1),
              });
            }, 1000);
          } else {
            nextIdSubscription.unsubscribe();
            dataSubscription.unsubscribe();
            reject('I could not figure out the device id.');
          }
        });

      const dataSubscription = this.device.pipe(filter((device) => device.data)).subscribe(({ data }) => {
        clearTimeout(tryNextIdTimeout);
        nextIdSubscription.unsubscribe();
        dataSubscription.unsubscribe();
        resolve(new ConfigurerFunctionParms(serialPort, data[0].toLowerCase()));
      });

      this.device.next({ possibleIds: 'abcdefghijklmnopqrstuvwxyz' });
    });
  }

  protected setId({ serialPort, id }: ConfigurerFunctionParms): Promise<ConfigurerFunctionParms> {
    return new Promise((resolve, reject) => {
      const dataTimeout = setTimeout(() => {
        dataSubscription.unsubscribe();
        reject(`Could not change the device id from ${id} to ${this.targetId}.`);
      }, 1000);

      const dataSubscription = this.device.pipe(filter((device) => device.data)).subscribe(({ data }) => {
        clearTimeout(dataTimeout);
        dataSubscription.unsubscribe();
        resolve(new ConfigurerFunctionParms(serialPort, data[0].toLowerCase()));
      });

      this.write(serialPort, `${id}@=${this.targetId}`);
    });
  }

  public configure(path: string): Promise<any> {
    return this.getSerialPort(path, this.getSerialPortOptions())
      .then(this.figureOutId.bind(this))
      .then(this.setId.bind(this));
  }
}

export { AlicatDeviceConfigurer, ConfigurerFunctionParms };
