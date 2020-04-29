import SerialPort from 'serialport';

interface SerialDeviceConfigurer {
  /** Configures a serial device to work with the Solvere.
   * 
   * @param path The path (COM, tty) for the device you want to configure.
   */
  configure(path: string): Promise<any>;
}

export default SerialDeviceConfigurer;
