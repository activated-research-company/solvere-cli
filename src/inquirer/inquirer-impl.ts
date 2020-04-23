import { injectable } from 'inversify';
import { Inquirer } from './inquirer';
import inquirer from 'inquirer';
import PromptUI from 'inquirer/lib/ui/prompt';

@injectable()
class InquirerImpl implements Inquirer {
  prompt(questions: inquirer.QuestionCollection<inquirer.ListQuestion>): Promise<inquirer.ListQuestion<inquirer.Answers>> & { ui: PromptUI; } {
    return inquirer.prompt(questions);
  }
}

export { InquirerImpl };