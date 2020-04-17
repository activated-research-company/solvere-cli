import { Question } from "../question/question";

interface Cli {
  version(str: string): Cli;
  action(fn: (...args: any[]) => void | Promise<void>): Cli;
  ask(questions: Question): Promise<{ [key: string] : string }>;
  go(): void;
};

export { Cli };