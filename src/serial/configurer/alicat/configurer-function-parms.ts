import SerialPort from 'serialport';

class ConfigurerFunctionParms {
  constructor(public serialPort: SerialPort, public id: string) {}
}

export default ConfigurerFunctionParms;
