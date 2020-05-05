import { AlicatDeviceConfigurer } from './alicat-device-configurer';

class AlicatPressureControlDeviceConfigurer extends AlicatDeviceConfigurer {
  constructor(targetId: string) {
    super(targetId);
  }

  public configure(path: string): Promise<any> {
    return super.configure(path).then(() => this.device.complete());
  }
}

export { AlicatPressureControlDeviceConfigurer };
