
import { Answers } from "./answers";

abstract class Question<T> {
  constructor(
    private questionNumber: number,
    private type: string,
    private name: string,
    private message: string,
    private answers?: Answers,
  ) {};

  public serialize(): { name: string, type: string, message: string, choices: string[] | null} {
    // TODO: figure out why name needs to be unique to ask the same question twice (rxjs or inquirer issue)
    return {
      name: `${this.name}|${this.questionNumber}`,
      type: this.type,
      message: this.message,
      choices: this.answers ? this.answers.list() : null,
    };
  }
}

export { Question };
