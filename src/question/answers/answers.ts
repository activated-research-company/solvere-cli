import Separator from 'inquirer/lib/objects/separator';

class Answers {
  constructor(
    private answers: { [key: string]: string },
  ) {};

  private getAnswerValue(key: string) {
    return this.answers[key];
  }

  public list(): (string | Separator)[] {
    const answerList: (string | Separator)[] = Object.keys(this.answers).map(this.getAnswerValue.bind(this));
    answerList.push(new Separator());
    answerList.push('Quit');
    return answerList;
  }
}

export { Answers };
