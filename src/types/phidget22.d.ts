declare module 'phidget22' {
  class Hub {
    public open(): Promise<any>;

    public close(): void;

    public writeDeviceLabel(label: string): Promise<any>;

    public getDeviceLabel(): string;
  }

  class Connection {
    constructor(private port: number, private address: string) {}

    public connect(): Promise<any>;

    public close(): void;
  }
}
