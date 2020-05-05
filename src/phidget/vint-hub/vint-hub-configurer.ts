// @ts-ignore
import phidget22 from 'phidget22';
import PhidgetDeviceConfigurer from '../phidget-device-configurer';

abstract class VintHubConfigurer extends PhidgetDeviceConfigurer {
  constructor(private label: string) {
    super();
  }

  public configure(): Promise<any> {
    return new Promise((resolve, reject) => {
      const channel = new phidget22.Hub();
      channel
        .open()
        .then(() => {
          channel
            .writeDeviceLabel(this.label)
            .then(() => {
              if (channel.getDeviceLabel() === this.label) {
                channel.close();
                resolve();
              } else {
                channel.close();
                reject('Failed to write device label.');
              }
            })
            .catch((error: any) => {
              channel.close();
              reject(`Could not write device label: ${error}`);
            });
        })
        .catch((error: any) => {
          channel.close();
          reject(`Could not open channel: ${error}`);
        });
    });
  }
}

export default VintHubConfigurer;
