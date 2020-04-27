import SerialPort from 'serialport';
import { DeviceAnswers } from '../question/device-question';
import VocDeviceConfigurer from '../serial-device/voc-device-configurer';
import { Answers } from '../question/answers';

class SerialPortService {
  serialPorts: string[];
  targetDeviceType: string;

  constructor() {
    this.serialPorts = []
    this.targetDeviceType = '';
    this.reset();
  }

  reset(): Promise<void> {
    return SerialPort
    .list()
    .then((ports) => {
      this.serialPorts = [];
      ports.forEach((port) => {
        this.serialPorts.push(port.path);
      });
    });
  }
  
  getTargetDeviceType(): string {
    return this.targetDeviceType;
  }

  setTargetDeviceType(newTargetDeviceType: string): void {
    this.targetDeviceType = newTargetDeviceType;
  }

  findNewSerialPort(): Promise<SerialPort | null> {
    return SerialPort
      .list()
      .then((ports) => {
        return ports.find((port) => {
          return !this.serialPorts.find((path) => {
            return path === port.path
          });
        });
      })
      .then((port) => {
        if (port) {
          return new SerialPort(port.path)
        }
        return null;
    });
  }
  
  configure(serialPort: SerialPort): Promise<boolean> {
    switch (this.targetDeviceType) {
      case DeviceAnswers.vocSensor:
        return new VocDeviceConfigurer().configure(serialPort);
    }
    return Promise.resolve(false);
  }
}

export default new SerialPortService()