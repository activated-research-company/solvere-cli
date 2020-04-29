import { SerialDevice } from './serial-device';
import VocDeviceConfigurer from './voc-device-configurer';
import AlicatDeviceConfigurer from './alicat-device-configurer';

class SerialDeviceConfigurerResolver {
  public getConfigurer(serialDevice: SerialDevice | null) {
    switch (serialDevice) {
      case SerialDevice.vocSensor:
        return new VocDeviceConfigurer();
      case SerialDevice.cellAir:
        return new AlicatDeviceConfigurer();
    }
  }
}

export { SerialDeviceConfigurerResolver };
