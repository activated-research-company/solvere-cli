interface Command {
  version(str: string): this;
  action(fn: (...args: any[]) => void | Promise<void>) : this;
  parse(argv?: string[] | undefined): this;
}

export { Command };
