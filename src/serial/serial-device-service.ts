import SerialPort from 'serialport';
import { Observable, Subject } from 'rxjs';
import { Answers } from 'inquirer';
import SerialDeviceConfigurerResolver from './configurer/serial-device-configurer-resolver';
import ConfigurationResult from '../device/configuration-result';

class SerialDeviceService {
  private serialPorts: string[] = [];

  private targetDeviceType: string | null;

  constructor(
    private serialDeviceConfigurerResolver: SerialDeviceConfigurerResolver,
    private subject: Subject<ConfigurationResult>,
  ) {
    this.targetDeviceType = null;
    this.reset();
  }

  private reset(): Promise<void> {
    return SerialPort.list().then((ports) => {
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
        if (answer === 'No') {
          this.reset();
        }
        break;
      case 'isDevicePluggedInTwo':
        if (answer === 'Yes') {
          this.findNewSerialPort()
            .then(this.configure.bind(this))
            .then(() => {
              this.subject.next(new ConfigurationResult(this.targetDeviceType, true));
            })
            .catch((error) => {
              this.subject.next(new ConfigurationResult(this.targetDeviceType, false, error));
            });
        }
        break;
      default:
        break;
    }
  }

  public connectToPrompt(observable: Observable<Answers>): SerialDeviceService {
    observable.subscribe(this.onAnsweredQuestion.bind(this));
    return this;
  }

  public connectToConfigurationResult(subject: Subject<ConfigurationResult>): SerialDeviceService {
    this.subject = subject;
    return this;
  }

  public getTargetDeviceType(): string | null {
    return this.targetDeviceType;
  }

  private findNewSerialPort(): Promise<string | null> {
    return SerialPort.list()
      .then((ports) => {
        return ports.find((port) => {
          return !this.serialPorts.find((path) => {
            return path === port.path;
          });
        });
      })
      .then((port) => (port ? port.path : null));
  }

  private configure(path: string | null): Promise<any> {
    if (!path) {
      return Promise.reject(`I could not locate the ${this.targetDeviceType}.`);
    }
    const configurer = this.serialDeviceConfigurerResolver.getConfigurer(this.targetDeviceType);

    if (configurer) {
      return configurer.configure(path);
    }
    return Promise.reject('Could not find a matching configurer.');
  }
}

export default SerialDeviceService;
