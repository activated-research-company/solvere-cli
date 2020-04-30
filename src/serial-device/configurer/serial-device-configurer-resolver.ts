import { SerialDevice } from '../serial-device';
import { VocDeviceConfigurer } from './voc-device-configurer';
import { AlicatDeviceConfigurer } from './alicat-device-configurer';
import { AlicatFlowControlDeviceConfigurer } from './alicat-flow-control-device-configurer';
import { AlicatPressureControlDeviceConfigurer } from './alicat-pressure-controller-device-configurer';

class SerialDeviceConfigurerResolver {
  public getConfigurer(serialDevice: SerialDevice | null) {
    switch (serialDevice) {
      case SerialDevice.vocSensor:
        return new VocDeviceConfigurer();
      case SerialDevice.cellAir:
        return new AlicatFlowControlDeviceConfigurer('x');
      case SerialDevice.fidAir:
        return new AlicatFlowControlDeviceConfigurer('a');
      case SerialDevice.fidHydrogen:
        return new AlicatFlowControlDeviceConfigurer('h');
      case SerialDevice.pressureController:
        return new AlicatPressureControlDeviceConfigurer('c');
    }
  }
}

export { SerialDeviceConfigurerResolver };
