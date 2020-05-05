// @ts-ignore
import phidget22 from 'phidget22';
import { Observable, Subject } from 'rxjs';
import { Answers } from 'inquirer';
import PhidgetDeviceConfigurerResolver from './phidget-device-configurer-resolver';
import ConfigurationResult from '../device/configuration-result';

class PhidgetDeviceService {
  private targetDevice: string | null;

  private phidgetManager: any;

  constructor(
    private phidgetDeviceConfigurerResolver: PhidgetDeviceConfigurerResolver,
    private subject: Subject<ConfigurationResult>,
  ) {
    this.phidgetManager = new phidget22.Connection(5661, 'localhost');
    this.phidgetManager.connect().catch((error: any) => {
      console.log(error);
    });
    this.targetDevice = null;
  }

  private onAnsweredQuestion({ name, answer }: Answers): void {
    if (answer === 'Quit') {
      this.phidgetManager.close();
    } else {
      switch (name.split('|')[0]) {
        case 'device':
          this.targetDevice = answer;
          break;
        case 'isOnlyPhidget':
          if (answer === 'Yes') {
            this.configure()
              .then(() => {
                this.subject.next(new ConfigurationResult(this.targetDevice, true));
              })
              .catch((error) => {
                this.subject.next(new ConfigurationResult(this.targetDevice, false, error));
              });
          }
          break;
        default:
          break;
      }
    }
  }

  public connectToPrompt(observable: Observable<Answers>): PhidgetDeviceService {
    observable.subscribe(this.onAnsweredQuestion.bind(this));
    return this;
  }

  public connectToConfigurationResult(subject: Subject<ConfigurationResult>): PhidgetDeviceService {
    this.subject = subject;
    return this;
  }

  public gettargetDevice(): string | null {
    return this.targetDevice;
  }

  private configure(): Promise<any> {
    const configurer = this.phidgetDeviceConfigurerResolver.getConfigurer(this.targetDevice);

    if (configurer) {
      return configurer.configure();
    }
    return Promise.reject('Could not find a matching configurer.');
  }
}

export default PhidgetDeviceService;
