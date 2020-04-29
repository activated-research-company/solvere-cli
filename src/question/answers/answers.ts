class Answers {
  constructor(
    private answers: { [key: string]: string },
  ) {};

  public list(): Array<string> {
    const answerList = Object.keys(this.answers).map((answer) => this.answers[answer]);
    answerList.push('Quit');
    return answerList;
  }
}

export { Answers };
