import { Answers } from "./answers";

abstract class Question {
  constructor(
    private name: string,
    private message: string,
    private answers: Answers,
  ) {};

  getName() {
    return this.name;
  }

  getMessage() {
    return this.message;
  }

  getAnswers() {
    return this.answers.list();
  }
}

export { Question };
