import { AlicatDeviceConfigurer, ConfigurerFunctionParms } from './alicat-device-configurer';
import { filter } from 'rxjs/operators';

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
      const dataTimeout = setTimeout(() => {
        dataSubscription.unsubscribe();
        reject(`Could not change the device ramp rate to ${rampRate} SCCM/s.`);
      }, 1000);

      const dataSubscription = this
        .device
        .pipe(filter(device => device.data))
        .subscribe(({ data }) => {
          switch (data) {
            case `${id.toUpperCase()}   160 = ${rampRate}`:
              this.write(serialPort, `${id}$$161=${rampTime}`);
              break;
            case `${id.toUpperCase()}   161 = ${rampTime}`:
              this.write(serialPort, `${id}$$162=${rampUnits}`);
              break;
            case `${id.toUpperCase()}   162 = ${rampUnits}`:
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
    return super
      .configure(path)
      .then(this.setRampRate.bind(this))
      .then(() => this.device.complete());
  }
}

export { AlicatFlowControlDeviceConfigurer }