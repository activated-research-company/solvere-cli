import { SerialDevice } from '../serial-device';
import { VocDeviceConfigurer } from './voc-device-configurer';
import { AlicatFlowControlDeviceConfigurer } from './alicat/alicat-flow-control-device-configurer';
import { AlicatPressureControlDeviceConfigurer } from './alicat/alicat-pressure-controller-device-configurer';
import SerialDeviceConfigurer from './serial-device-configurer';

class SerialDeviceConfigurerResolver {
  public getConfigurer(serialDevice: string | null): SerialDeviceConfigurer | null {
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
      default:
        return null;
    }
  }
}

export default SerialDeviceConfigurerResolver;
