abstract class PhidgetDeviceConfigurer {
  abstract configure(): Promise<any>;
}

export default PhidgetDeviceConfigurer;
