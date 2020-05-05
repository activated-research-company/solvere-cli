import { Subject } from 'rxjs';
import SerialPort from 'serialport';
import SerialPortOptions from './serial-port-options';

abstract class SerialDeviceConfigurer {
  protected device: Subject<any>;

  constructor() {
    this.device = new Subject<any>();
  }

  private onData(data: any): void {
    this.device.next({ data: data.toString() });
  }

  /** Returns a promise that resolves with an open SerialPort
   *
   * @param path The path of the serial port you want to open
   * @param options Options for opening and communicating with the SerialPort
   */
  protected getSerialPort(path: string, options: SerialPortOptions): Promise<SerialPort> {
    const serialPort = new SerialPort(path, options.getOpenOptions());

    if (options.hasDelimiter()) {
      serialPort.pipe(options.getDelimiter()).on('data', this.onData.bind(this));
    } else {
      serialPort.on('data', this.onData.bind(this));
    }

    this.device.subscribe(undefined, undefined, () => {
      serialPort.close();
    });

    return new Promise((resolve) => serialPort.open(() => resolve(serialPort)));
  }

  /** Configures a serial device to work with the Solvere
   *
   * @param path The path (COM, tty) for the device you want to configure
   */
  abstract configure(path: string): Promise<any>;
}

export default SerialDeviceConfigurer;
