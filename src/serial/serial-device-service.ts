import SerialPort from 'serialport';
import { Observable, Subject } from 'rxjs';
import { Answers } from 'inquirer';
import { SerialDevice } from './serial-device';
import { SerialDeviceConfigurerResolver } from './serial-device-configurer-resolver';

class ConfigurationResult {
  constructor(
    public serialDevice: SerialDevice | null,
    public configured: boolean,
    public error?: string,
  ) {
    this.error = !error ? '' : error;
  }
}

class SerialDeviceService {
  private serialPorts: string[] = [];
  private targetDeviceType: SerialDevice | null;
  public subject: Subject<ConfigurationResult>;

  constructor(
    private serialDeviceConfigurerResolver: SerialDeviceConfigurerResolver) {
    this.subject = new Subject();
    this.targetDeviceType = null;
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
  
  public getTargetDeviceType(): SerialDevice | null {
    return this.targetDeviceType;
  }

  private findNewSerialPort(): Promise<string | null> {
    return SerialPort
      .list()
      .then((ports) => {
        return ports.find((port) => {
          return !this.serialPorts.find((path) => {
            return path === port.path
          });
        });
      })
      .then((port) => port ? port.path: null);
  }
  
  private configure(path: string | null): Promise<any> {
    if (!path) { return Promise.reject(`I could not locate the ${this.targetDeviceType}.`); }
    const configurer = this
      .serialDeviceConfigurerResolver
      .getConfigurer(this.targetDeviceType);
      
    if (configurer) { return configurer.configure(path); }
    return Promise.reject('Could not find a matching configurer.')
  }
}

export { SerialDeviceService, ConfigurationResult };
