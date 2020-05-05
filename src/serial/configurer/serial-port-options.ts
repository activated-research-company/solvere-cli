const Delimiter = require('@serialport/parser-delimiter'); // TODO: fix types so import works

class SerialPortOptions {
  constructor(private baudRate: number, private delimiter?: string | Buffer) {}

  public hasDelimiter() {
    return this.delimiter;
  }

  public getDelimiter(): any {
    return this.hasDelimiter() ? new Delimiter({ delimiter: this.delimiter }) : null;
  }

  public getOpenOptions() {
    return {
      autoOpen: false,
      baudRate: this.baudRate,
    };
  }
}

export default SerialPortOptions;
