class Answers {
  constructor(
    private answers: { [key: string]: string },
  ) {};

  list(): Array<string> {
    return Object.keys(this.answers).map((answer) => this.answers[answer]);
  }
}

export { Answers };
