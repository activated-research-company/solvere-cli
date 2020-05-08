import { filter } from 'rxjs/operators';
import { AlicatDeviceConfigurer, ConfigurerFunctionParms } from './alicat-device-configurer';

class AlicatFlowControlDeviceConfigurer extends AlicatDeviceConfigurer {
  constructor(targetId: string) {
    super(targetId);
  }

  /**
   * Sets the ramp rate to the target setpoint
   *
   * @param serialPort  SerialPort to write commands to
   * @param id  Device id
   */
  private setRampRate({ serialPort, id }: ConfigurerFunctionParms) {
    const rampRate = 200;
    const rampTime = 1000;
    const rampUnits = 4;

    return new Promise((resolve, reject) => {
      let dataTimeout: NodeJS.Timeout;

      const dataSubscription = this.device.pipe(filter((device) => device.data)).subscribe(({ data }) => {
        switch (data) {
          case `${id.toUpperCase()}   160 = ${rampRate}`:
            this.write(serialPort, `${id}W161=${rampTime}`);
            break;
          case `${id.toUpperCase()}   161 = ${rampTime}`:
            this.write(serialPort, `${id}W162=${rampUnits}`);
            break;
          case `${id.toUpperCase()}   162 = ${rampUnits}`:
            dataSubscription.unsubscribe();
            resolve();
            break;
          default:
            reject(`Received unknown response: ${data}`);
            break;
        }
        clearTimeout(dataTimeout);
      });

      dataTimeout = setTimeout(() => {
        dataSubscription.unsubscribe();
        reject(`Could not change the device ramp rate to ${rampRate} SCCM/s.`);
      }, 1000);

      this.write(serialPort, `${id}W160=${rampRate}`);
    });
  }

  public configure(path: string): Promise<any> {
    return super
      .configure(path)
      .then(this.setRampRate.bind(this))
      .then(() => this.device.complete());
  }
}

export { AlicatFlowControlDeviceConfigurer };
