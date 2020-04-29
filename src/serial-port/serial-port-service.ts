import SerialPort from 'serialport';
import { Observable, Subject } from 'rxjs';
import { Answers } from 'inquirer';
import { DeviceAnswers } from '../question/device-question';
import VocDeviceConfigurer from '../serial-device/voc-device-configurer';
import Advisor from '../advisor/advisor';
import AlicatDeviceConfigurer from '../serial-device/alicat-device-configurer';

class ConfigurationResult {
  constructor(
    public device: string,
    public configured: boolean,
    public error?: string,
  ) {
    this.error = !error ? '' : error;
  }
}

class SerialPortService {
  private serialPorts: string[] = [];
  private targetDeviceType: string = '';
  public subject: Subject<ConfigurationResult>;

  constructor(private advisor: Advisor) {
    this.subject = new Subject();
    this.reset();
  }

  public getObservable(): Observable<any> {
    return this.subject;
  }

  private reset(): Promise<void> {
    return SerialPort
    .list()
    .then((ports) => {
      this.serialPorts = [];
      ports.forEach((port) => {
        this.serialPorts.push(port.path);
      });
    });
  }

  private onAnsweredQuestion({ name, answer }: Answers): void {
    switch (name.split('|')[0]) {
      case 'device':
        this.targetDeviceType = answer;
        break;
      case 'isDevicePluggedInOne':
        if (answer === 'No') { this.reset(); }
        break;
      case 'isDevicePluggedInTwo':
        if (answer === 'Yes') {
          this.findNewSerialPort()
            .then(this.configure.bind(this))
            .then(() => {
              this.subject.next(new ConfigurationResult(this.targetDeviceType, true))
            })
            .catch((error) => {
              this.subject.next(new ConfigurationResult(this.targetDeviceType, false, error));
            });;
        }
        break;
      default:
        break;
    }
  }

  public connect(observable: Observable<Answers>) {
    observable.subscribe(this.onAnsweredQuestion.bind(this));
    return this;
  }
  
  public getTargetDeviceType(): string {
    return this.targetDeviceType;
  }

  private findNewSerialPort(): Promise<SerialPort | null> {
    return SerialPort
      .list()
      .then((ports) => {
        return ports.find((port) => {
          return !this.serialPorts.find((path) => {
            return path === port.path
          });
        });
      })
      .then((port) => port ? new SerialPort(port.path, { autoOpen: false }) : null);
  }
  
  configure(serialPort: SerialPort | null): Promise<boolean> {
    if (!serialPort) { return Promise.reject(`I could not locate the ${this.targetDeviceType}.`); }
    switch (this.targetDeviceType) {
      case DeviceAnswers.vocSensor:
        return new VocDeviceConfigurer().configure(serialPort);
      case DeviceAnswers.cellAir:
        return new AlicatDeviceConfigurer().configure(serialPort);
    }
    return Promise.reject('This device is not a valid choice.');
  }
}

export { SerialPortService, ConfigurationResult };
