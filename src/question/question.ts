
import inquirer from 'inquirer';
import { Answers } from "./answers";

abstract class Question<T> {
  constructor(
    private type: string,
    private name: string,
    private message: string,
    private answers?: Answers,
  ) {};

  public ask(): Promise<{ [key: string]: T }> {
    return inquirer.prompt([{
      name: this.name,
      type: this.type,
      message: this.message,
      choices: this.answers ? this.answers.list() : null,
    }]);
  }
}

export { Question };
