
import { Answers } from "./answers/answers";

abstract class Question<T> {
  constructor(
    private questionNumber: number,
    private name: string,
    private message: string,
    private answers: Answers,
  ) {};

  public serialize(): { name: string, type: string, message: string, choices: string[] | null} {
    // TODO: why does name need to be unique (question number) to ask the same question >= twice (rxjs/inquirer issue)
    return {
      name: `${this.name}|${this.questionNumber}`,
      type: 'list',
      message: this.message,
      choices: this.answers ? this.answers.list() : null,
    };
  }
}

export { Question };
