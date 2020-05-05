import PhidgetDeviceConfigurer from './phidget-device-configurer';
import PhidgetDevice from './phidget-device';
import VintHubOneConfigurer from './vint-hub/vint-hub-one-configurer';
import VintHubTwoConfigurer from './vint-hub/vint-hub-two-configurer';

class PhidgetDeviceConfigurerResolver {
  public getConfigurer(device: string | null): PhidgetDeviceConfigurer | null {
    switch (device) {
      case PhidgetDevice.vintHubOne:
        return new VintHubOneConfigurer();
      case PhidgetDevice.vintHubTwo:
        return new VintHubTwoConfigurer();
      default:
        return null;
    }
  }
}

export default PhidgetDeviceConfigurerResolver;
